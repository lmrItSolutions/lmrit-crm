import { createContext, useContext, useState, useEffect } from 'react'
import { loginToAria } from '../services/ariaAPI'

const AriaContext = createContext()

export function useAria() {
  const context = useContext(AriaContext)
  if (!context) {
    throw new Error('useAria must be used within an AriaProvider')
  }
  return context
}

export function AriaProvider({ children }) {
  const [ariaToken, setAriaToken] = useState(null)
  const [userID, setUserID] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ariaToken')
    const savedUserID = localStorage.getItem('ariaUserID')
    
    if (savedToken && savedUserID) {
      setAriaToken(savedToken)
      setUserID(savedUserID)
    }
  }, [])

  // Save token to localStorage when it changes
  useEffect(() => {
    if (ariaToken) {
      localStorage.setItem('ariaToken', ariaToken)
    } else {
      localStorage.removeItem('ariaToken')
    }
  }, [ariaToken])

  useEffect(() => {
    if (userID) {
      localStorage.setItem('ariaUserID', userID)
    } else {
      localStorage.removeItem('ariaUserID')
    }
  }, [userID])

  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = await loginToAria(username, password)
      setAriaToken(token)
      setUserID(username) // Using username as UserID for now
      return token
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAriaToken(null)
    setUserID(null)
    setError(null)
  }

  const isAuthenticated = !!ariaToken

  const value = {
    ariaToken,
    userID,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AriaContext.Provider value={value}>
      {children}
    </AriaContext.Provider>
  )
} 