"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Loading theme</span>
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme} className="relative">
      {/* Light Mode Icon (Show only when explicit 'light') */}
      <Sun 
        className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 absolute'}`} 
      />
      
      {/* Dark Mode Icon (Show only when explicit 'dark') */}
      <Moon 
        className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90 absolute'}`} 
      />
            
      {/* System Mode Icon (Show when 'system') */}
      <Laptop 
        className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'system' ? 'scale-100 rotate-0' : 'scale-0 rotate-90 absolute'}`} 
      />
              
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
