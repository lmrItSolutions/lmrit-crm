import { useState, useRef, useEffect } from "react"
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, Upload, Check } from "lucide-react"
import * as XLSX from 'xlsx'
import { maskPhoneNumber, cleanPhoneNumber } from '../utils/numberMasking'

const mockLeads = [
  {
    id: 1,
    name: "Sushiraj",
    email: "NA",
    phone: "9591555750",
    company: "THE100",
    status: "New",
    consent: "Yes",
    consentDate: "15-04-2025",
    state: "Karnataka",
  },
  {
    id: 2,
    name: "Rafiq",
    email: "NA",
    phone: "9700557557",
    company: "THE100",
    status: "Contacted",
    consent: "Yes",
    consentDate: "20-05-2025",
    state: "Andhra",
  },
  {
    id: 3,
    name: "Shantan",
    email: "NA",
    phone: "8722656642",
    company: "THE100",
    status: "Qualified",
    consent: "Yes",
    consentDate: "10-04-2025",
    state: "Karnataka",
  },
  {
    id: 4,
    name: "Virupaksha",
    email: "NA",
    phone: "9880965636",
    company: "THE100",
    status: "Lost",
    consent: "Yes",
    consentDate: "25-06-2025",
    state: "Karnataka",
  },
  {
    id: 5,
    name: "Rajshaker",
    email: "NA",
    phone: "9845409530",
    company: "THE100",
    status: "New",
    consent: "Yes",
    consentDate: "15-04-2025",
    state: "Karnataka",
  },
  {
    id: 6,
    name: "Pawan",
    email: "NA",
    phone: "7760131306",
    company: "THE100",
    status: "Contacted",
    consent: "Yes",
    consentDate: "05-07-2025",
    state: "Karnataka",
  },
  {
    id: 7,
    name: "prashanth01",
    email: "NA",
    phone: "8431370675",
    company: "THE100",
    status: "Qualified",
    consent: "Yes",
    consentDate: "28-06-2025",
    state: "Telangana",
  },
  {
    id: 8,
    name: "lokesh01",
    email: "NA",
    phone: "8310657075",
    company: "THE100",
    status: "New",
    consent: "Yes",
    consentDate: "12-05-2025",
    state: "Telangana",
  },
  {
    id: 9,
    name: "jhansi_2013",
    email: "NA",
    phone: "8618913424",
    company: "THE100",
    status: "Contacted",
    consent: "Yes",
    consentDate: "30-07-2025",
    state: "Andhra Pradesh",
  },
  { "id": 1, "name": "Jeevan87", "email": "NA", "phone": "7092881763", "company": "THE100", "status": "Contacted", "consent": "Yes","consentDate": "30-07-2025","state": "Karnataka" },
  { "id": 2, "name": "Junaid001", "email": "NA", "phone": "8431370675", "company": "THE100", "status": "New", "consent": "Yes","consentDate": "06-06-2025", "state": "Andhra" },
  { "id": 3, "name": "JayRaj", "email": "NA", "phone": "8197339788", "company": "THE100", "status": "Followup", "consent": "Yes","consentDate": "14-04-2025", "state": "Karnataka" },
  { "id": 4, "name": "Veer47", "email": "NA", "phone": "8310657075", "company": "THE100", "status": "Contacted", "consent": "Yes","consentDate": "19-06-2025", "state": "Karnataka" },
  { "id": 5, "name": "Rajshaker", "email": "NA", "phone": "8618913424", "company": "THE100", "status": "New", "consent": "Yes","consentDate": "23-07-2025", "state": "Karnataka" },
  { "id": 6, "name": "Pawan", "email": "NA", "phone": "9986641040", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Karnataka" },
  { "id": 7, "name": "Sidhu", "email": "NA", "phone": "9986152599", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Karnataka" },
  { "id": 8, "name": "Ramesh", "email": "NA", "phone": "8197339788", "company": "THE100", "status": "New", "consent": "Yes", "state": "Karnataka" },
  { "id": 9, "name": "Basawraj", "email": "NA", "phone": "9742920666", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Karnataka" },
  { "id": 10, "name": "Amar", "email": "NA", "phone": "9632752132", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Karnataka" },
  { "id": 11, "name": "prashanth01", "email": "NA", "phone": "8431370675", "company": "THE100", "status": "New", "consent": "Yes", "state": "Telangana" },
  { "id": 12, "name": "lokesh01", "email": "NA", "phone": "8310657075", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Telangana" },
  { "id": 13, "name": "jhansi2013", "email": "NA", "phone": "8618913424", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Andhra" },
  { "id": 14, "name": "jeevan", "email": "NA", "phone": "9066363396", "company": "THE100", "status": "New", "consent": "Yes", "state": "Telangana" },
  { "id": 15, "name": "sasi kumar", "email": "NA", "phone": "7092881763", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Andhra" },
  { "id": 16, "name": "subramanayam", "email": "NA", "phone": "8465070062", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Telangana" },
  { "id": 17, "name": "mamatha", "email": "NA", "phone": "7892338622", "company": "THE100", "status": "New", "consent": "Yes", "state": "Andhra" },
  { "id": 18, "name": "sunil", "email": "NA", "phone": "998622844", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Telangana" },
  { "id": 19, "name": "madangowda", "email": "NA", "phone": "9241000276", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Karnataka" },
  { "id": 20, "name": "farooq", "email": "NA", "phone": "760095645", "company": "THE100", "status": "New", "consent": "Yes", "state": "Andhra" },
  { "id": 21, "name": "raghu22", "email": "NA", "phone": "9148744499", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Telangana" },
  { "id": 22, "name": "shiva kumar07", "email": "NA", "phone": "9964474305", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Karnataka" },
  { "id": 23, "name": "shankar", "email": "NA", "phone": "9880055855", "company": "THE100", "status": "New", "consent": "Yes", "state": "Karnataka" },
  { "id": 24, "name": "santhumtd", "email": "NA", "phone": "805082946", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Telangana" },
  { "id": 25, "name": "ajay22", "email": "NA", "phone": "7204342152", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Andhra" },
  { "id": 26, "name": "babu38", "email": "NA", "phone": "9986641040", "company": "THE100", "status": "New", "consent": "Yes", "state": "Karnataka" },
  { "id": 27, "name": "raj22", "email": "NA", "phone": "7204342152", "company": "THE100", "status": "Followup", "consent": "Yes", "state": "Telangana" },
  { "id": 28, "name": "syeed22", "email": "NA", "phone": "7899363331", "company": "THE100", "status": "Contacted", "consent": "Yes", "state": "Andhra" },
  { "id": 29, "name": "logi11", "email": "NA", "phone": "9724660812", "company": "THE100", "status": "New", "consent": "Yes", "state": "Telangana" }
]


function getStatusColor(status) {
  switch (status) {
    case "New":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
    case "Contacted":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    case "Qualified":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    case "Lost":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
    case "Followup":
      return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
  }
}

function getConsentColor(consent) {
  return consent === "Yes" 
    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
}

// Add function to check if consent is valid (within 6 months)
function isConsentValid(consentDate) {
  if (!consentDate) return false
  const consent = new Date(consentDate)
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  return consent >= sixMonthsAgo
}

// Add function to get consent status with date validation
function getConsentStatus(consent, consentDate) {
  if (consent === "No") return { text: "No", color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" }
  if (consent === "Yes" && isConsentValid(consentDate)) {
    return { text: "Yes (Valid)", color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" }
  }
  return { text: "Yes (Expired)", color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" }
}

export default function Leads() {
  // Use mock data directly without localStorage
  const [leads, setLeads] = useState(mockLeads)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    consent: "Yes",
    consentDate: new Date().toISOString().split('T')[0], // Default to today
    state: "",
  })
  const fileInputRef = useRef(null)

  // Remove localStorage useEffect - no longer needed

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery)
    const matchesStatus = statusFilter === "" || lead.status === statusFilter
    const matchesState = stateFilter === "" || lead.state === stateFilter
    return matchesSearch && matchesStatus && matchesState
  })

  const handleDeleteLead = (id) => {
    setLeads(leads.filter(lead => lead.id !== id))
  }

  const handleAddLead = (e) => {
    e.preventDefault()
    const id = Math.max(...leads.map(lead => lead.id)) + 1
    const newLeadWithId = { ...newLead, id }
    setLeads([...leads, newLeadWithId])
    setShowAddModal(false)
    setNewLead({ name: "", email: "", phone: "", company: "", status: "New", consent: "Yes", consentDate: new Date().toISOString().split('T')[0], state: "" })
  }

  const handleEditLead = (e) => {
    e.preventDefault()
    setLeads(leads.map(lead => 
      lead.id === selectedLead.id ? selectedLead : lead
    ))
    setShowEditModal(false)
    setSelectedLead(null)
  }

  const handleViewLead = (lead) => {
    setSelectedLead(lead)
    setShowViewModal(true)
  }

  const handleEditLeadClick = (lead) => {
    setSelectedLead({ ...lead })
    setShowEditModal(true)
  }

  const handleSetAllConsent = (consent) => {
    setLeads(leads.map(lead => ({ ...lead, consent })))
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")
    XLSX.writeFile(workbook, "leads_export.xlsx")
  }

  const importFromExcel = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          // Transform the data to match our lead structure
          const importedLeads = jsonData.map((row, index) => {
            // Handle various column name formats
            const name = row.Name || row.name || row.NAME || ''
            const phone = row.Number || row.number || row.NUMBER || row.Phone || row.phone || ''
            const state = row.State || row.state || row.STATE || ''
            
            // Generate email from name (handle special characters)
            const cleanName = name.replace(/[^a-zA-Z0-9]/g, '') // Remove special characters for email
            const email = cleanName ? `${cleanName}@example.com` : `lead${index + 1}@example.com`
            
            return {
              id: Math.max(...leads.map(lead => lead.id)) + index + 1,
              name: name,
              email: email,
              phone: phone.toString(),
              company: "Imported Company",
              status: "New",
              consent: "Yes",
              state: state,
            }
          })
          
          setLeads([...leads, ...importedLeads])
          
          // Reset file input
          event.target.value = ''
          
          // Show success message
          alert(`Successfully imported ${importedLeads.length} leads!`)
        } catch (error) {
          console.error('Error importing file:', error)
          alert('Error importing file. Please check the file format and try again.')
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current.click()
  }

  const resetToOriginalData = () => {
    if (window.confirm('Are you sure you want to reset to original data? This will clear all your changes.')) {
      setLeads(mockLeads)
    }
  }

  // Get unique states for filter dropdown
  const uniqueStates = [...new Set(leads.map(lead => lead.state))].filter(Boolean).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your sales leads and track progress</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
          <button
            onClick={resetToOriginalData}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            title="Reset to original data"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={importFromExcel}
        accept=".xlsx,.xls"
        className="hidden"
      />

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Followup">Followup</option>
        </select>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All States</option>
          {uniqueStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => handleSetAllConsent("Yes")}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <Check className="h-3 w-3" />
            All Yes
          </button>
          <button
            onClick={() => handleSetAllConsent("No")}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            All No
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Consent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Consent Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.map((lead) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {lead.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConsentColor(lead.consent)}`}>
                      {lead.consent}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {lead.consentDate ? (
                      <div>
                        <div className="text-gray-900 dark:text-white">{lead.consentDate}</div>
                        {lead.consent === "Yes" && (
                          <div className={`text-xs ${isConsentValid(lead.consentDate) ? 'text-green-600' : 'text-orange-600'}`}>
                            {isConsentValid(lead.consentDate) ? '' : ''}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewLead(lead)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditLeadClick(lead)}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
                        // Handle both ISO format (yyyy-mm-dd) and dash format (dd-mm-yyyy)
                        if (newLead.consentDate.includes('-')) {
                          const parts = newLead.consentDate.split('-');
                          if (parts.length === 3) {
                            if (parts[0].length === 4) {
                              // ISO format: yyyy-mm-dd
                              return new Date(newLead.consentDate).toLocaleDateString('en-GB');
                            } else {
                              // Dash format: dd-mm-yyyy
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
                    // Convert dd/mm/yyyy to yyyy-mm-dd for storage
                    if (input.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                      const [day, month, year] = input.split('/');
                      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                      setNewLead({...newLead, consentDate: isoDate});
                    } else {
                      // Store the input as-is if it doesn't match the format
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
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
                         // Handle both ISO format (yyyy-mm-dd) and dash format (dd-mm-yyyy)
                         if (selectedLead.consentDate.includes('-')) {
                           const parts = selectedLead.consentDate.split('-');
                           if (parts.length === 3) {
                             if (parts[0].length === 4) {
                               // ISO format: yyyy-mm-dd
                               return new Date(selectedLead.consentDate).toLocaleDateString('en-GB');
                             } else {
                               // Dash format: dd-mm-yyyy
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
                     // Convert dd/mm/yyyy to yyyy-mm-dd for storage
                     if (input.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                       const [day, month, year] = input.split('/');
                       const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                       setSelectedLead({...selectedLead, consentDate: isoDate});
                     } else {
                       // Store the input as-is if it doesn't match the format
                       setSelectedLead({...selectedLead, consentDate: input});
                     }
                   }}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required={selectedLead.consent === "Yes"}
                 />
                 <p className="text-xs text-gray-500 mt-1">
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
                      <div>{selectedLead.consentDate}</div>
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditLeadClick(selectedLead)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}