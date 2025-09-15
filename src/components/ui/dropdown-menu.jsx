import React, { useState, useRef, useEffect } from "react"

export function DropdownMenu({ children, open, onOpenChange }) {
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuTrigger({ children, onClick }) {
  return <div onClick={onClick}>{children}</div>
}

export function DropdownMenuContent({ children, align = "start", isOpen, onClose }) {
  const contentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg ring-1 ring-black ring-opacity-5 ${
        align === "end" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
    >
      {children}
    </button>
  )
}
