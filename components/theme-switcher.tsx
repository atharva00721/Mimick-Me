'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Always render the same element structure on server and client first-pass.
  // Moon is the safe default — resolvedTheme is undefined on the server.
  // After mount the icon updates to reflect the actual resolved theme.
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
