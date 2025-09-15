import React from "react"

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
      default: "bg-primary text-white hover:bg-primary/90",
      ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      icon: "h-9 w-9",
    }

    const classes = [base, variants[variant], sizes[size], className]
      .filter(Boolean)
      .join(" ")

    return <button ref={ref} className={classes} {...props} />
  }
)

Button.displayName = "Button"
