// Temporary mock service to keep the app working while we set up Supabase
class MockLeadsService {
  constructor() {
    this.leads = [
      {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890',
        interested: 'Yes',
        contacted_date: new Date().toISOString().split('T')[0],
        state: 'California',
        status: 'New',
        assigned_to: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        id: '2',
        name: 'Jane Smith',
        phone: '+1987654321',
        interested: 'No',
        contacted_date: new Date().toISOString().split('T')[0],
        state: 'New York',
        status: 'Contacted',
        assigned_to: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        phone: '+1555123456',
        interested: 'Yes',
        contacted_date: new Date().toISOString().split('T')[0],
        state: 'Texas',
        status: 'Qualified',
        assigned_to: '550e8400-e29b-41d4-a716-446655440000'
      }
    ]
  }

  async getLeads(filters = {}) {
    console.log('🔄 MockLeadsService.getLeads called')
    console.log('📊 Filters:', filters)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredLeads = [...this.leads]
    
    // Apply filters
    if (filters.status && filters.status !== 'All') {
      filteredLeads = filteredLeads.filter(lead => lead.status === filters.status)
    }
    
    if (filters.interested && filters.interested !== 'All') {
      filteredLeads = filteredLeads.filter(lead => lead.interested === filters.interested)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredLeads = filteredLeads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm) ||
        lead.state.toLowerCase().includes(searchTerm)
      )
    }
    
    console.log('✅ Mock leads loaded:', filteredLeads.length)
    return { success: true, data: filteredLeads, error: null }
  }

  async createLead(leadData) {
    console.log('🔄 MockLeadsService.createLead called')
    console.log('📝 Lead data:', leadData)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    this.leads.unshift(newLead)
    
    console.log('✅ Mock lead created:', newLead)
    return { success: true, data: newLead, error: null }
  }

  async updateLead(id, updates) {
    console.log('🔄 MockLeadsService.updateLead called')
    console.log('📝 Lead ID:', id, 'Updates:', updates)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const leadIndex = this.leads.findIndex(lead => lead.id === id)
    
    if (leadIndex === -1) {
      return { success: false, data: null, error: 'Lead not found' }
    }
    
    this.leads[leadIndex] = {
      ...this.leads[leadIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    console.log('✅ Mock lead updated:', this.leads[leadIndex])
    return { success: true, data: this.leads[leadIndex], error: null }
  }

  async deleteLead(id) {
    console.log('🔄 MockLeadsService.deleteLead called')
    console.log('📝 Lead ID:', id)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const leadIndex = this.leads.findIndex(lead => lead.id === id)
    
    if (leadIndex === -1) {
      return { success: false, error: 'Lead not found' }
    }
    
    this.leads.splice(leadIndex, 1)
    
    console.log('✅ Mock lead deleted')
    return { success: true, error: null }
  }
}

export default new MockLeadsService()
