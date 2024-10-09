import React, { useState } from 'react'
import { PlusCircle, MessageSquare, Edit2, Trash } from 'lucide-react'

interface Chat {
  id: string;
  name: string;
  history: { role: string; content: string }[];
}

interface ChatManagementProps {
  chats: Chat[];
  currentChatId: string | null;
  onCreateNewChat: () => void;
  onSwitchChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newName: string) => void;
}

const ChatManagement: React.FC<ChatManagementProps> = ({
  chats,
  currentChatId,
  onCreateNewChat,
  onSwitchChat,
  onDeleteChat,
  onRenameChat,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [newChatName, setNewChatName] = useState('')

  const handleRenameClick = (chatId: string, currentName: string) => {
    setEditingChatId(chatId)
    setNewChatName(currentName)
  }

  const handleRenameSubmit = (chatId: string) => {
    if (newChatName.trim()) {
      onRenameChat(chatId, newChatName.trim())
      setEditingChatId(null)
      setNewChatName('')
    }
  }

  return (
    <div className="w-1/5 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Chats</h2>
      <button
        onClick={onCreateNewChat}
        className="mb-6 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-200"
      >
        <PlusCircle className="mr-2" size={20} />
        New Chat
      </button>
      <div className="flex-grow overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSwitchChat(chat.id)}
          >
            {editingChatId === chat.id ? (
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onBlur={() => handleRenameSubmit(chat.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(chat.id)}
                className="bg-gray-600 text-white px-2 py-1 rounded w-full"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  <span className="truncate">{chat.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRenameClick(chat.id, chat.name)
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatManagement