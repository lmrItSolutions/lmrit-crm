// Utility functions for phone number masking

// Mask a phone number (e.g., +91 97xxxxxx93)
export function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // Handle different formats
  if (cleaned.startsWith('+')) {
    // International format: +91 97xxxxxx93
    const countryCode = cleaned.substring(0, 3) // +91
    const remaining = cleaned.substring(3)
    
    if (remaining.length >= 10) {
      const firstTwo = remaining.substring(0, 2) // 97
      const lastTwo = remaining.substring(remaining.length - 2) // 93
      const masked = 'x'.repeat(remaining.length - 4) // xxxxxx
      return `${countryCode} ${firstTwo}${masked}${lastTwo}`
    }
  } else {
    // Local format: 97xxxxxx93
    if (cleaned.length >= 10) {
      const firstTwo = cleaned.substring(0, 2)
      const lastTwo = cleaned.substring(cleaned.length - 2)
      const masked = 'x'.repeat(cleaned.length - 4)
      return `${firstTwo}${masked}${lastTwo}`
    }
  }
  
  // Fallback: mask all but first and last 2 digits
  if (cleaned.length >= 4) {
    const firstTwo = cleaned.substring(0, 2)
    const lastTwo = cleaned.substring(cleaned.length - 2)
    const masked = 'x'.repeat(cleaned.length - 4)
    return `${firstTwo}${masked}${lastTwo}`
  }
  
  return cleaned
}

// Clean phone number for dialing (remove all non-digit characters except +)
export function cleanPhoneNumber(phoneNumber) {
  if (!phoneNumber) return ''
  return phoneNumber.replace(/[^\d+]/g, '')
}

// Validate phone number format
export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false
  
  const cleaned = cleanPhoneNumber(phoneNumber)
  
  // Check for international format (+91xxxxxxxxxx)
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 12 && cleaned.length <= 15
  }
  
  // Check for local format (10-11 digits)
  return cleaned.length >= 10 && cleaned.length <= 11
} 