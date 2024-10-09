import React, { useState, useEffect, useRef } from 'react'
import { Send, Bold, Italic, List, Code, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface InteractionPanelProps {
  chatHistory: { role: string; content: string }[]
  onSendPrompt: (prompt: string) => void
  isLoading: boolean
  context: string
  outputFormat: string
  onClearHistory: () => void
  error: string | null
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({
  chatHistory,
  onSendPrompt,
  isLoading,
  context,
  outputFormat,
  onClearHistory,
  error,
}) => {
  const [prompt, setPrompt] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onSendPrompt(prompt.trim())
      setPrompt('')
    }
  }

  const insertFormatting = (startTag: string, endTag: string = startTag) => {
    const textArea = document.getElementById('prompt-input') as HTMLTextAreaElement
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    const selectedText = prompt.substring(start, end)
    const newText = prompt.substring(0, start) + startTag + selectedText + endTag + prompt.substring(end)
    setPrompt(newText)
    
    setTimeout(() => {
      textArea.focus()
      textArea.setSelectionRange(start + startTag.length, end + startTag.length)
    }, 0)
  }

  return (
    <div className="w-3/5 bg-gray-50 p-6 flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3/4 p-4 rounded-lg shadow-md ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <ReactMarkdown className="prose max-w-none">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-2 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => insertFormatting('**')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => insertFormatting('*')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => insertFormatting('- ')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Bullet List"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => insertFormatting('```\n', '\n```')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Code Block"
            >
              <Code size={20} />
            </button>
          </div>
          <button
            onClick={onClearHistory}
            className="p-1 hover:bg-gray-100 rounded text-red-500 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            placeholder="Enter your prompt here..."
            disabled={isLoading}
          />
          <div className="flex justify-end p-2">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Processing...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InteractionPanel