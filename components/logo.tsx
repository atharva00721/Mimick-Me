import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor = true }: { className?: string; uniColor?: boolean }) => {
    return (
        <img
            src="/logo.svg"
            alt="Logo"
            className={cn('h-auto w-auto', className)}
        />
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <img
            src="/logo.svg"
            alt="Logo Icon"
            className={cn('h-auto w-auto', className)}
        />
    )
}
