import React, { useState, useEffect } from 'react'
import CustomizationPanel from './components/CustomizationPanel'
import InteractionPanel from './components/InteractionPanel'
import ChatManagement from './components/ChatManagement'
import OpenAI from 'openai'

interface Chat {
  id: string;
  name: string;
  history: { role: string; content: string }[];
}

function App() {
  const [context, setContext] = useState('Functional Testing')
  const [outputFormat, setOutputFormat] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [openai, setOpenai] = useState<OpenAI | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (apiKey && apiKey !== 'dummy_api_key_for_preview_purposes_only') {
      setOpenai(new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: This is not recommended for production
      }))
    } else {
      setApiKeyMissing(true)
    }

    // Load chats from local storage
    const savedChats = localStorage.getItem('aiTestCaseChats')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      setCurrentChatId(parsedChats[0]?.id || null)
    } else {
      // Create a default chat if no chats exist
      const defaultChat: Chat = { id: Date.now().toString(), name: 'New Chat', history: [] }
      setChats([defaultChat])
      setCurrentChatId(defaultChat.id)
    }
  }, [])

  useEffect(() => {
    // Save chats to local storage whenever they change
    localStorage.setItem('aiTestCaseChats', JSON.stringify(chats))
  }, [chats])

  const handleContextChange = (newContext: string) => {
    setContext(newContext)
  }

  const handleOutputFormatChange = (newFormat: string) => {
    setOutputFormat(newFormat)
  }

  const handleFileUpload = (files: FileList | null) => {
    // TODO: Implement file upload logic
    console.log('Files uploaded:', files)
  }

  const handleSendPrompt = async (prompt: string) => {
    setError(null)
    if (!openai) {
      setError('OpenAI is not initialized. Please check your API key.')
      return
    }
    if (!currentChatId) {
      setError('No chat selected. Please create a new chat or select an existing one.')
      return
    }

    setIsLoading(true)
    const userMessage = { role: 'user', content: prompt }
    
    setChats(prevChats => prevChats.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, history: [...chat.history, userMessage] }
        : chat
    ))

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are an AI assistant specialized in generating test cases for ${context}. Output format: ${outputFormat}` },
          ...chats.find(chat => chat.id === currentChatId)!.history,
          userMessage
        ],
      })

      const aiMessage = { role: 'assistant', content: response.choices[0].message.content || 'No response' }
      setChats(prevChats => prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, history: [...chat.history, aiMessage] }
          : chat
      ))
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      setError('An error occurred while processing your request. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const createNewChat = () => {
    const newChat: Chat = { id: Date.now().toString(), name: 'New Chat', history: [] }
    setChats(prevChats => [...prevChats, newChat])
    setCurrentChatId(newChat.id)
  }

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || null)
    }
  }

  const clearChatHistory = () => {
    setChats(prevChats => prevChats.map(chat => 
      chat.id === currentChatId ? { ...chat, history: [] } : chat
    ))
  }

  const renameChat = (chatId: string, newName: string) => {
    setChats(prevChats => prevChats.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    ))
  }

  if (apiKeyMissing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600">API Key Missing or Invalid</h1>
          <p className="mb-4">
            The OpenAI API key is missing or invalid. Please set a valid VITE_OPENAI_API_KEY environment variable.
          </p>
          <p className="mb-4">
            Create a <code className="bg-gray-200 p-1 rounded">.env</code> file in the project root with the following content:
          </p>
          <pre className="bg-gray-200 p-2 rounded mb-4">
            VITE_OPENAI_API_KEY=your_openai_api_key_here
          </pre>
          <p>
            Replace <code className="bg-gray-200 p-1 rounded">your_openai_api_key_here</code> with your actual OpenAI API key.
          </p>
        </div>
      </div>
    )
  }

  const currentChat = chats.find(chat => chat.id === currentChatId)

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatManagement
        chats={chats}
        currentChatId={currentChatId}
        onCreateNewChat={createNewChat}
        onSwitchChat={switchChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
      />
      <InteractionPanel
        chatHistory={currentChat?.history || []}
        onSendPrompt={handleSendPrompt}
        isLoading={isLoading}
        context={context}
        outputFormat={outputFormat}
        onClearHistory={clearChatHistory}
        error={error}
      />
      <CustomizationPanel
        context={context}
        outputFormat={outputFormat}
        onContextChange={handleContextChange}
        onOutputFormatChange={handleOutputFormatChange}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}

export default App