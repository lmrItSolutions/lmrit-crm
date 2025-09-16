import { useState, useEffect } from "react"
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Upload, Check } from "lucide-react"
import * as XLSX from 'xlsx'
import { maskPhoneNumber, cleanPhoneNumber } from '../utils/numberMasking'
import supabaseLeads from '../services/supabaseLeads'
import supabaseAuth from '../services/supabaseAuth'

// Helper functions
function isConsentValid(consentDate) {
  if (!consentDate) return false
  const consent = new Date(consentDate)
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  return consent >= sixMonthsAgo
}

function getConsentStatus(consent, consentDate) {
  if (consent === "No") return { text: "No", color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" }
  if (consent === "Yes" && isConsentValid(consentDate)) {
    return { text: "Yes (Valid)", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" }
  }
  return { text: "Yes (Expired)", color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" }
}

function getConsentColor(consent) {
  if (consent === "Yes") return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
  return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
}

export default function LeadsSupabase() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [consentFilter, setConsentFilter] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    consent: "Yes",
    consentDate: new Date().toISOString().split('T')[0],
    state: "",
    assigned_to: ""
  })

  // Load current user and leads on component mount
  useEffect(() => {
    loadCurrentUser()
    loadLeads()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const { success, data } = await supabaseAuth.getCurrentUser()
      if (success && data) {
        setCurrentUser(data.profile)
        setNewLead(prev => ({ ...prev, assigned_to: data.profile.id }))
      } else {
        // Create a default user for testing
        const defaultUser = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          role: 'agent'
        }
        setCurrentUser(defaultUser)
        setNewLead(prev => ({ ...prev, assigned_to: defaultUser.id }))
      }
    } catch (error) {
      console.error('Error loading user:', error)
      // Create a default user for testing
      const defaultUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        role: 'agent'
      }
      setCurrentUser(defaultUser)
      setNewLead(prev => ({ ...prev, assigned_to: defaultUser.id }))
    }
  }

  const loadLeads = async () => {
    try {
      setLoading(true)
      console.log('Loading leads from Supabase...')
      const { success, data, error } = await supabaseLeads.getLeads()
      
      console.log('Supabase response:', { success, data, error })
      
      if (success) {
        setLeads(data || [])
        setError(null)
        console.log('Leads loaded successfully:', data?.length || 0, 'leads')
      } else {
        setError(error)
        console.error('Error loading leads:', error)
        // If no leads found, show empty array instead of error
        if (error && error.includes('No rows found')) {
          setLeads([])
          setError(null)
        }
      }
    } catch (err) {
      setError('Failed to load leads')
      console.error('Error loading leads:', err)
      // Show empty array on error
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter
    const matchesConsent = consentFilter === "All" || lead.consent === consentFilter
    
    return matchesSearch && matchesStatus && matchesConsent
  })

  // Handle add lead
  const handleAddLead = async (e) => {
    e.preventDefault()
    try {
      const { success, data, error } = await supabaseLeads.createLead(newLead)
      
      if (success) {
        setLeads([data, ...leads])
        setShowAddModal(false)
        setNewLead({
          name: "",
          email: "",
          phone: "",
          company: "",
          status: "New",
          consent: "Yes",
          consentDate: new Date().toISOString().split('T')[0],
          state: "",
          assigned_to: currentUser?.id || ""
        })
      } else {
        setError(error)
        console.error('Error adding lead:', error)
      }
    } catch (err) {
      setError('Failed to add lead')
      console.error('Error adding lead:', err)
    }
  }

  // Handle edit lead
  const handleEditLead = async (e) => {
    e.preventDefault()
    try {
      console.log('Updating lead:', selectedLead.id, selectedLead)
      const { success, data, error } = await supabaseLeads.updateLead(selectedLead.id, selectedLead)
      
      console.log('Update response:', { success, data, error })
      
      if (success) {
        setLeads(leads.map(lead => lead.id === selectedLead.id ? data : lead))
        setShowEditModal(false)
        setSelectedLead(null)
        console.log('Lead updated successfully')
      } else {
        setError(error)
        console.error('Error updating lead:', error)
        alert(`Error updating lead: ${error}`)
      }
    } catch (err) {
      setError('Failed to update lead')
      console.error('Error updating lead:', err)
      alert(`Failed to update lead: ${err.message}`)
    }
  }

  // Handle delete lead
  const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        const { success, error } = await supabaseLeads.deleteLead(leadId)
        
        if (success) {
          setLeads(leads.filter(lead => lead.id !== leadId))
        } else {
          setError(error)
          console.error('Error deleting lead:', error)
        }
      } catch (err) {
        setError('Failed to delete lead')
        console.error('Error deleting lead:', err)
      }
    }
  }

  // Handle view lead
  const handleViewLead = (lead) => {
    setSelectedLead(lead)
    setShowViewModal(true)
  }

  // Handle edit lead
  const handleEditLeadClick = (lead) => {
    setSelectedLead(lead)
    setShowEditModal(true)
  }

  // Export to Excel
  const handleExport = () => {
    const dataToExport = filteredLeads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Company: lead.company,
      Status: lead.status,
      Consent: lead.consent,
      'Consent Date': lead.consentDate,
      State: lead.state,
      'Created At': new Date(lead.created_at).toLocaleDateString()
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Leads")
    XLSX.writeFile(wb, "leads.xlsx")
  }

  // Import from Excel
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Process imported data
        const importedLeads = jsonData.map((row, index) => ({
          name: row.Name || row.name || '',
          email: row.Email || row.email || `${row.Name || 'lead'}_${index}@example.com`,
          phone: row.Phone || row.phone || '',
          company: row.Company || row.company || '',
          status: row.Status || row.status || 'New',
          consent: row.Consent || row.consent || 'No',
          consentDate: row['Consent Date'] || row.consentDate || null,
          state: row.State || row.state || '',
          assigned_to: currentUser?.id || ''
        }))

        // Add leads to database
        for (const leadData of importedLeads) {
          await supabaseLeads.createLead(leadData)
        }

        // Reload leads
        loadLeads()
        alert(`Successfully imported ${importedLeads.length} leads`)
      } catch (error) {
        console.error('Error importing file:', error)
        alert('Error importing file. Please check the format.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
              <option value="Converted">Converted</option>
              <option value="Followup">Followup</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consent</label>
            <select
              value={consentFilter}
              onChange={(e) => setConsentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Consent</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("All")
                setConsentFilter("All")
              }}
              className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Consent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Consent Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.map((lead) => {
                const consentStatus = getConsentStatus(lead.consent, lead.consentDate)
                return (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {maskPhoneNumber(lead.phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${consentStatus.color}`}>
                        {consentStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {lead.consentDate ? (
                        <div>
                          <div className="text-gray-900 dark:text-white">
                            {new Date(lead.consentDate).toLocaleDateString('en-GB')}
                          </div>
                          {lead.consent === "Yes" && (
                            <div className={`text-xs ${isConsentValid(lead.consentDate) ? 'text-green-600' : 'text-orange-600'}`}>
                              {isConsentValid(lead.consentDate) ? 'Valid' : 'Expired'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.status === 'New' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        lead.status === 'Qualified' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        lead.status === 'Lost' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        lead.status === 'Converted' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                        'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditLeadClick(lead)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input
                  type="text"
                  value={newLead.state}
                  onChange={(e) => setNewLead({...newLead, state: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input
                  type="text"
                  value={newLead.company}
                  onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Consent</label>
                <select
                  value={newLead.consent}
                  onChange={(e) => setNewLead({...newLead, consent: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consent Date</label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={(() => {
                    try {
                      if (newLead.consentDate) {
                        if (newLead.consentDate.includes('-')) {
                          const parts = newLead.consentDate.split('-');
                          if (parts.length === 3) {
                            if (parts[0].length === 4) {
                              return new Date(newLead.consentDate).toLocaleDateString('en-GB');
                            } else {
                              const [day, month, year] = parts;
                              return `${day}/${month}/${year}`;
                            }
                          }
                        }
                        return newLead.consentDate;
                      }
                      return '';
                    } catch (error) {
                      return newLead.consentDate || '';
                    }
                  })()}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                      const [day, month, year] = input.split('/');
                      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      setNewLead({...newLead, consentDate: isoDate});
                    } else {
                      setNewLead({...newLead, consentDate: input});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={newLead.consent === "Yes"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: dd/mm/yyyy (e.g., 15/04/2025)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={newLead.status}
                  onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                  <option value="Followup">Followup</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add Lead
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Lead</h2>
            <form onSubmit={handleEditLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedLead.name}
                  onChange={(e) => setSelectedLead({...selectedLead, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedLead.email}
                  onChange={(e) => setSelectedLead({...selectedLead, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={selectedLead.phone}
                  onChange={(e) => setSelectedLead({...selectedLead, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <input
                  type="text"
                  value={selectedLead.state}
                  onChange={(e) => setSelectedLead({...selectedLead, state: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input
                  type="text"
                  value={selectedLead.company}
                  onChange={(e) => setSelectedLead({...selectedLead, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Consent</label>
                <select
                  value={selectedLead.consent}
                  onChange={(e) => setSelectedLead({...selectedLead, consent: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consent Date</label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={(() => {
                    try {
                      if (selectedLead.consentDate) {
                        if (selectedLead.consentDate.includes('-')) {
                          const parts = selectedLead.consentDate.split('-');
                          if (parts.length === 3) {
                            if (parts[0].length === 4) {
                              return new Date(selectedLead.consentDate).toLocaleDateString('en-GB');
                            } else {
                              const [day, month, year] = parts;
                              return `${day}/${month}/${year}`;
                            }
                          }
                        }
                        return selectedLead.consentDate;
                      }
                      return '';
                    } catch (error) {
                      return selectedLead.consentDate || '';
                    }
                  })()}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (input.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                      const [day, month, year] = input.split('/');
                      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      setSelectedLead({...selectedLead, consentDate: isoDate});
                    } else {
                      setSelectedLead({...selectedLead, consentDate: input});
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={selectedLead.consent === "Yes"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: dd/mm/yyyy (e.g., 15/04/2025)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => setSelectedLead({...selectedLead, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                  <option value="Followup">Followup</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Update Lead
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lead Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <p className="text-sm text-gray-900 dark:text-white">{maskPhoneNumber(selectedLead.phone)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLead.state}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLead.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Consent</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConsentColor(selectedLead.consent)}`}>
                  {selectedLead.consent}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consent Date</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedLead.consentDate ? (
                    <div>
                      <div>{new Date(selectedLead.consentDate).toLocaleDateString('en-GB')}</div>
                      {selectedLead.consent === "Yes" && (
                        <div className={`text-xs ${isConsentValid(selectedLead.consentDate) ? 'text-green-600' : 'text-orange-600'}`}>
                          {isConsentValid(selectedLead.consentDate) ? 'Valid' : 'Expired'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedLead.status === 'New' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  selectedLead.status === 'Contacted' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  selectedLead.status === 'Qualified' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  selectedLead.status === 'Lost' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                  selectedLead.status === 'Converted' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                  'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                }`}>
                  {selectedLead.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(selectedLead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
