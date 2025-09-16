import React from 'react'

export default function LeadsTest() {
  console.log('🧪 LeadsTest component loaded - this is a test component')
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        🧪 Test Leads Component
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is a test component to verify routing is working.
      </p>
      <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200">
          If you see this, the routing is working correctly!
        </p>
      </div>
    </div>
  )
}
