import { useState } from "react";
import { Search, Send, MoreVertical } from "lucide-react";

const mockChats = [
  {
    id: 1,
    contact: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    lastMessage: "Thanks for the proposal! I'll review it and get back to you.",
    timestamp: "2 hours ago",
    unread: 2,
    status: "online",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    contact: "Michael Chen",
    phone: "+1 (555) 987-6543",
    lastMessage: "Can you send me the pricing details?",
    timestamp: "4 hours ago",
    unread: 0,
    status: "offline",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    contact: "Emily Rodriguez",
    phone: "+1 (555) 456-7890",
    lastMessage: "Perfect! Let's schedule a call for tomorrow.",
    timestamp: "1 day ago",
    unread: 1,
    status: "online",
    avatar: "/placeholder.svg",
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    message: "Hi! I'm interested in your services",
    timestamp: "10:30 AM",
    type: "received",
  },
  {
    id: 2,
    sender: "You",
    message: "Hello Sarah! Thanks for reaching out. What can I help you with?",
    timestamp: "10:32 AM",
    type: "sent",
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    message: "I'm looking for a CRM solution for my team",
    timestamp: "10:35 AM",
    type: "received",
  },
  {
    id: 4,
    sender: "You",
    message: "Great! I'd be happy to help. Can you tell me more about your team size and requirements?",
    timestamp: "10:37 AM",
    type: "sent",
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    message: "We're a team of 15 people, mostly sales and marketing",
    timestamp: "10:40 AM",
    type: "received",
  },
];

export default function WhatsAppChat() {
  const [chats, setChats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "sent",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex bg-white dark:bg-gray-800">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">WhatsApp Chats</h2>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {chat.contact.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.contact}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedChat.contact.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedChat.contact}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedChat.phone}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === "sent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === "sent"
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === "sent" ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a chat</h3>
              <p className="text-gray-500 dark:text-gray-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
