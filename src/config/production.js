// Production configuration
export const productionConfig = {
  // App settings
  appName: 'CRM System',
  version: '1.0.0',
  environment: 'production',
  
  // Supabase settings
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // Feature flags
  features: {
    phoneMasking: true,
    consentValidation: true,
    realTimeUpdates: true,
    exportToExcel: true,
    darkMode: true,
  },
  
  // Security settings
  security: {
    enableRLS: true,
    requireConsent: true,
    consentValidityMonths: 6,
  },
  
  // UI settings
  ui: {
    itemsPerPage: 25,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
  },
  
  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Monitoring
  monitoring: {
    enableLogging: true,
    logLevel: 'info',
    enableAnalytics: true,
  }
}

// Validation function
export function validateProductionConfig() {
  const required = ['supabase.url', 'supabase.anonKey']
  const missing = required.filter(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], productionConfig)
    return !value
  })
  
  if (missing.length > 0) {
    console.error('❌ Missing required production configuration:', missing)
    return false
  }
  
  console.log('✅ Production configuration validated')
  return true
}
