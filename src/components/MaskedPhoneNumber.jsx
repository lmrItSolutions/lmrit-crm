import { useState } from 'react'
import { Phone, Lock } from 'lucide-react'
import { maskPhoneNumber, cleanPhoneNumber } from '../utils/numberMasking'
import { useAria } from '../context/AriaContext'
import { dialNumber } from '../services/ariaAPI'

export default function MaskedPhoneNumber({ phoneNumber, leadId, leadName, showMasked = false }) {
  const [isDialing, setIsDialing] = useState(false)
  const { ariaToken, userID, isAuthenticated } = useAria()

  const maskedNumber = maskPhoneNumber(phoneNumber)
  const cleanedNumber = cleanPhoneNumber(phoneNumber)

  const handleCall = async () => {
    if (!isAuthenticated) {
      alert('Please login to Aria dialer first')
      return
    }

    if (!cleanedNumber) {
      alert('Invalid phone number')
      return
    }

    setIsDialing(true)
    try {
      const result = await dialNumber(ariaToken, userID, cleanedNumber, leadId)
      console.log('Dial result:', result)
      
      // You can add additional logic here based on the API response
      // For example, show call status, redirect to call interface, etc.
       
    } catch (error) {
      console.error('Failed to dial number:', error)
      alert(`Failed to initiate call: ${error.message}`)
    } finally {
      setIsDialing(false)
    } 
  }

  // Prevent context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  // Prevent text selection
  const handleSelectStart = (e) => {
    e.preventDefault()
    return false
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Phone Number Display - Can be masked or unmasked */}
      <div 
        className="flex items-center space-x-1 select-none"
        onContextMenu={handleContextMenu}
        onSelectStart={handleSelectStart}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {showMasked && <Lock className="h-3 w-3 text-gray-400" />}
        <span className="text-sm text-gray-900 dark:text-white font-mono">
          {showMasked ? maskedNumber : phoneNumber}
        </span>
      </div>
      
      {/* Call Button Only */}
      <button
        onClick={handleCall}
        disabled={isDialing || !isAuthenticated}
        className={`p-1 transition-colors ${
          isDialing 
            ? 'text-gray-400 cursor-not-allowed' 
            : isAuthenticated
              ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
              : 'text-gray-400 cursor-not-allowed'
        }`}
        title={isAuthenticated ? `Call ${leadName} via Aria dialer` : 'Login to Aria dialer first'}
      >
        <Phone className="h-4 w-4" />
      </button>
      
      {/* Loading indicator for dialing */}
      {isDialing && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
      )}
    </div>
  )
} 