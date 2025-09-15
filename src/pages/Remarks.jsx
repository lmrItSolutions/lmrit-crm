import { useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, User, Calendar, MessageSquare } from "lucide-react";

const mockRemarks = [
  {
    id: 1,
    title: "Follow-up Required",
    content: "Client showed interest in premium package. Need to send detailed proposal by end of week.",
    contact: "Sarah Johnson",
    category: "Follow-up",
    priority: "High",
    user: "John Doe",
    timestamp: "2024-01-15 14:30",
    status: "pending",
  },
  {
    id: 2,
    title: "Pricing Discussion",
    content: "Discussed pricing options with client. They want to see enterprise pricing tier.",
    contact: "Michael Chen",
    category: "Sales",
    priority: "Medium",
    user: "Jane Smith",
    timestamp: "2024-01-15 11:15",
    status: "completed",
  },
  {
    id: 3,
    title: "Technical Requirements",
    content: "Client has specific technical requirements that need to be reviewed by our engineering team.",
    contact: "Emily Rodriguez",
    category: "Technical",
    priority: "High",
    user: "Mike Wilson",
    timestamp: "2024-01-14 16:20",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Contract Review",
    content: "Contract terms discussed. Client wants to negotiate payment terms.",
    contact: "David Thompson",
    category: "Legal",
    priority: "Medium",
    user: "John Doe",
    timestamp: "2024-01-14 13:10",
    status: "pending",
  },
  {
    id: 5,
    title: "Demo Scheduled",
    content: "Product demo scheduled for next Tuesday at 2 PM. Client is excited to see the new features.",
    contact: "Lisa Wang",
    category: "Demo",
    priority: "Low",
    user: "Jane Smith",
    timestamp: "2024-01-13 15:45",
    status: "completed",
  },
];

function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function Remarks() {
  const [remarks, setRemarks] = useState(mockRemarks);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredRemarks = remarks.filter((remark) => {
    const matchesSearch = 
      remark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remark.contact.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || remark.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || remark.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleDeleteRemark = (id) => {
    setRemarks(remarks.filter(remark => remark.id !== id));
  };

  const categories = [...new Set(remarks.map(remark => remark.category))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Remarks & Notes</h1>
        <p className="text-gray-600">Manage customer remarks and important notes</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Remark
            </button>
          </div>
        </div>
      </div>

      {/* Remarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRemarks.map((remark) => (
          <div key={remark.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{remark.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{remark.contact}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(remark.priority)}`}>
                  {remark.priority}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(remark.status)}`}>
                  {remark.status}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-3">{remark.content}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="font-medium">{remark.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-2" />
                <span>{remark.user}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{remark.timestamp}</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button 
                onClick={() => handleDeleteRemark(remark.id)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Remark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Remark</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea 
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Follow-up</option>
                    <option>Sales</option>
                    <option>Technical</option>
                    <option>Legal</option>
                    <option>Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
