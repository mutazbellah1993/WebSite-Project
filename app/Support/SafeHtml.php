<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

class SafeHtml
{
    private const ALLOWED_TAGS = [
        'a',
        'blockquote',
        'br',
        'em',
        'h2',
        'h3',
        'li',
        'ol',
        'p',
        'strong',
        'ul',
    ];

    public static function sanitize(?string $html): ?string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return null;
        }

        if ($html === strip_tags($html)) {
            return self::plainTextToHtml($html);
        }

        $html = (string) preg_replace(
            '/<\s*(script|style|iframe|object|embed|form|input|button|svg|math)[^>]*>.*?<\s*\/\s*\1\s*>/is',
            '',
            $html,
        );
        $html = (string) preg_replace(
            '/<\s*\/?\s*(script|style|iframe|object|embed|form|input|button|svg|math)[^>]*>/i',
            '',
            $html,
        );

        $previous = libxml_use_internal_errors(true);
        $document = new DOMDocument('1.0', 'UTF-8');
        $document->loadHTML(
            '<?xml encoding="UTF-8"><div>'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $container = $document->getElementsByTagName('div')->item(0);

        if (! $container instanceof DOMElement) {
            return null;
        }

        self::cleanNode($container);

        $output = '';

        foreach ($container->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        $output = trim($output);

        return $output !== '' ? $output : null;
    }

    private static function plainTextToHtml(string $text): string
    {
        $paragraphs = preg_split('/\R{2,}/', trim($text)) ?: [];

        return collect($paragraphs)
            ->map(fn (string $paragraph): string => '<p>'.nl2br(e(trim($paragraph)), false).'</p>')
            ->implode('');
    }

    private static function cleanNode(DOMNode $node): void
    {
        for ($child = $node->firstChild; $child !== null; $child = $next) {
            $next = $child->nextSibling;

            if ($child instanceof DOMElement) {
                $tag = strtolower($child->tagName);

                if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                    $child->parentNode?->replaceChild(
                        $child->ownerDocument->createTextNode($child->textContent),
                        $child,
                    );

                    continue;
                }

                self::cleanAttributes($child);
            }

            self::cleanNode($child);
        }
    }

    private static function cleanAttributes(DOMElement $element): void
    {
        $tag = strtolower($element->tagName);
        $allowed = $tag === 'a' ? ['href', 'title', 'target', 'rel'] : [];

        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->nodeName);
            $value = trim($attribute->nodeValue ?? '');

            if (! in_array($name, $allowed, true) || str_starts_with($name, 'on') || $name === 'style') {
                $element->removeAttribute($attribute->nodeName);

                continue;
            }

            if ($name === 'href' && ! self::safeUrl($value)) {
                $element->removeAttribute('href');
            }
        }

        if ($tag === 'a' && $element->getAttribute('target') === '_blank') {
            $element->setAttribute('rel', 'noopener noreferrer');
        }
    }

    private static function safeUrl(string $value): bool
    {
        return str_starts_with($value, '/')
            || str_starts_with($value, '#')
            || preg_match('/^(https?:|mailto:|tel:)/i', $value) === 1;
    }
}
