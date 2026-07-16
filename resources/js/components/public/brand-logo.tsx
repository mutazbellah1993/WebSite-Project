import { Link } from '@inertiajs/react';
import { homePath } from '@/lib/public-content';

type BrandLogoProps = {
    variant?: 'default' | 'light';
    className?: string;
};

export function BrandLogo({ variant = 'default', className = '' }: BrandLogoProps) {
    const src = variant === 'light' ? '/brand/elitedata-logo-light.svg' : '/brand/elitedata-logo.svg';

    return (
        <Link href={homePath} className={`inline-flex items-center ${className}`} aria-label="ELITEDATA">
            <img src={src} alt="ELITEDATA" className="h-12 w-auto sm:h-14" />
        </Link>
    );
}
