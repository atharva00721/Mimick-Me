import { LogoIcon } from '@/components/logo'
import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'

const links = [
    { label: 'Explore', href: '/explore' },
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
]

export default function Footer() {
    return (
        <footer className="bg-background @container py-12">
            <div className="mx-auto max-w-2xl px-6">
                <div className="flex flex-col">
                    <Link
                        href="/"
                        aria-label="Go to home page"
                        title="Mimick.me home"
                        className="hover:bg-foreground/5 -ml-1.5 flex size-30 rounded-lg *:m-auto">
                        <LogoIcon
                            uniColor
                            className="w-fit"
                        />
                    </Link>
                    <nav aria-label="Footer" className="my-8 flex flex-wrap gap-x-8 gap-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                title={link.label}
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <ThemeSwitcher />

                    <p className="text-muted-foreground mt-2 border-t pt-6 text-sm">&copy; {new Date().getFullYear()} Mimick.me. </p>
                </div>
            </div>
        </footer>
    )
}
