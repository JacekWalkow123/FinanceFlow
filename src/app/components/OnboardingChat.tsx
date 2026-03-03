"use client"
import { useState } from 'react'

export default function OnboardingChat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Welcome! 👋 What's a good name for your household?" }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    const newMessages = [...messages, 
      { role: "user", content: input },
      { role: "bot", content: "Great! How many people are in this household?" }
    ]
    setMessages(newMessages)
    setInput('')
  }

  return (
    <div className="h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold">Money Cockpit Setup</h2>
        <p className="opacity-90 mt-1">Step 1 of 6</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 border-t bg-white">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 w-12 flex items-center justify-center">
            →
          </button>
        </div>
      </div>
    </div>
  )
}
