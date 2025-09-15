import React from 'react'
import { cn } from '../../../lib/utils/styles'

const Footer = ({
    className
}: {
    className?: string
}) => {
  return (
    <footer className={cn("bg-gray-800 p-4 text-white text-center", className)}>
      <p>&copy; 2024 My App. All rights reserved.</p>
    </footer>
  )
}

export default Footer