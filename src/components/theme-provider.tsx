"use client"

import * as React from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  forcedTheme?: string
  themes?: string[]
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  )
}
