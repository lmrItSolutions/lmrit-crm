// Aria API Integration for Dialer Workflow
const ARIA_API_BASE_URL = "https://<aria-api-url>" // Replace with actual Aria API URL

// Login to Aria and get authentication token
export async function loginToAria(username, password) {
  try {
    const response = await fetch(`${ARIA_API_BASE_URL}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error("Aria login error:", error)
    throw error
  }
}

// Dial a number using Aria Dialer
export async function dialNumber(token, userID, number, clientID) {
  try {
    const response = await fetch(`${ARIA_API_BASE_URL}/DialNumber`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        UserID: userID, 
        Number: number, 
        ClientID: clientID 
      })
    })

    if (!response.ok) {
      throw new Error(`Dial failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Aria dial error:", error)
    throw error
  }
}

// Get call status
export async function getCallStatus(token, callID) {
  try {
    const response = await fetch(`${ARIA_API_BASE_URL}/CallStatus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Aria status check error:", error)
    throw error
  }
}

// End call
export async function endCall(token, callID) {
  try {
    const response = await fetch(`${ARIA_API_BASE_URL}/EndCall`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ CallID: callID })
    })

    if (!response.ok) {
      throw new Error(`End call failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Aria end call error:", error)
    throw error
  }
} 