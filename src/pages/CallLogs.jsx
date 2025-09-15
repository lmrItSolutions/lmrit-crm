import { useState } from "react";
import { Search, Filter, Phone, Clock, User, Calendar, PhoneCall, PhoneMissed, PhoneIncoming } from "lucide-react";

const mockCallLogs = [
  {
    id: 1,
    type: "outgoing",
    contact: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    duration: "15:32",
    timestamp: "2024-01-15 14:30",
    status: "completed",
    user: "John Doe",
    notes: "Discussed proposal details and next steps. Client showed interest in premium package.",
    recording: "recording_001.mp3",
  },
  {
    id: 2,
    type: "incoming",
    contact: "Michael Chen",
    phone: "+1 (555) 987-6543",
    duration: "08:45",
    timestamp: "2024-01-15 11:15",
    status: "completed",
    user: "Jane Smith",
    notes: "Client called to ask about pricing. Sent follow-up email with detailed quote.",
    recording: "recording_002.mp3",
  },
  {
    id: 3,
    type: "outgoing",
    contact: "Emily Rodriguez",
    phone: "+1 (555) 456-7890",
    duration: "00:00",
    timestamp: "2024-01-15 09:45",
    status: "missed",
    user: "Mike Wilson",
    notes: "No answer. Left voicemail with callback request.",
    recording: null,
  },
  {
    id: 4,
    type: "incoming",
    contact: "David Thompson",
    phone: "+1 (555) 321-0987",
    duration: "22:18",
    timestamp: "2024-01-14 16:20",
    status: "completed",
    user: "John Doe",
    notes: "Long discussion about project requirements. Client wants to schedule a meeting.",
    recording: "recording_003.mp3",
  },
  {
    id: 5,
    type: "outgoing",
    contact: "Lisa Wang",
    phone: "+1 (555) 654-3210",
    duration: "05:12",
    timestamp: "2024-01-14 13:10",
    status: "completed",
    user: "Jane Smith",
    notes: "Quick follow-up call. Client confirmed receipt of proposal.",
    recording: "recording_004.mp3",
  },
];

function getCallIcon(type) {
  switch (type) {
    case "outgoing":
      return <PhoneCall className="h-4 w-4 text-green-600" />;
    case "incoming":
      return <PhoneIncoming className="h-4 w-4 text-blue-600" />;
    case "missed":
      return <PhoneMissed className="h-4 w-4 text-red-600" />;
    default:
      return <Phone className="h-4 w-4 text-gray-600" />;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "missed":
      return "bg-red-100 text-red-800";
    case "busy":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function CallLogs() {
  const [callLogs, setCallLogs] = useState(mockCallLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const filteredCallLogs = callLogs.filter((call) => {
    const matchesSearch = 
      call.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phone.includes(searchQuery) ||
      call.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || call.type === typeFilter;
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    const matchesUser = userFilter === "all" || call.user === userFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesUser;
  });

  const uniqueUsers = [...new Set(callLogs.map(call => call.user))];

  const totalCalls = callLogs.length;
  const completedCalls = callLogs.filter(call => call.status === "completed").length;
  const missedCalls = callLogs.filter(call => call.status === "missed").length;
  const totalDuration = callLogs
    .filter(call => call.duration !== "00:00")
    .reduce((total, call) => {
      const [minutes, seconds] = call.duration.split(":").map(Number);
      return total + minutes * 60 + seconds;
    }, 0);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
        <p className="text-gray-600">Track and manage all call activities</p>
      </div>

      {/* Call Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCalls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PhoneCall className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedCalls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <PhoneMissed className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Missed</p>
              <p className="text-2xl font-semibold text-gray-900">{missedCalls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Duration</p>
              <p className="text-2xl font-semibold text-gray-900">{formatDuration(totalDuration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search calls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="outgoing">Outgoing</option>
              <option value="incoming">Incoming</option>
              <option value="missed">Missed</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
              <option value="busy">Busy</option>
            </select>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCallLogs.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{call.contact}</div>
                      <div className="text-sm text-gray-500">{call.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCallIcon(call.type)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{call.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {call.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {call.recording && (
                        <button className="text-blue-600 hover:text-blue-900">
                          Play
                        </button>
                      )}
                      <button className="text-green-600 hover:text-green-900">
                        Call
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Notes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
