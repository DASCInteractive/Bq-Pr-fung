import { useState, useEffect } from 'react'
import { load, save } from '../lib/storage'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = load('darkMode')
    if (saved !== null) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    save('darkMode', dark)
  }, [dark])

  const toggle = () => setDark((d) => !d)

  return { dark, toggle }
}
