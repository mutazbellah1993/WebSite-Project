import { Link } from '@inertiajs/react';
import { homePath } from '@/lib/public-content';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
    variant?: 'default' | 'light';
    className?: string;
};

export function BrandLogo({ variant = 'default', className = '' }: BrandLogoProps) {
    const needsWhiteContainer = variant === 'light';

    return (
        <Link
            href={homePath}
            className={cn(
                'inline-flex items-center',
                needsWhiteContainer && 'rounded-md bg-white p-2',
                className,
            )}
            aria-label="ELITEDATA"
        >
            <img
                src="/brand/elitedata-official-logo.png"
                alt="ELITEDATA"
                className="h-auto w-auto max-w-[180px] object-contain sm:max-w-[240px]"
            />
        </Link>
    );
}
