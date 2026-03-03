'use client'
import { useState, useRef, useEffect, FormEvent } from 'react'

export default function OnboardingChat() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      content: "Hi! 👋 I'm your FinanceFlow assistant. What's your biggest financial goal right now?" 
    }
  ])
  const [conversation, setConversation] = useState([
    { role: 'ai', content: "Hi! 👋 I'm your FinanceFlow assistant. What's your biggest financial goal right now?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: input 
    }
    
    // Update both displays
    setMessages(prev => [...prev, userMessage])
    const tempConversation = [...conversation, { role: 'user', content: input }]
    setConversation(tempConversation)
    setInput('')
    setIsLoading(true)

    try {
      // LLM API CALL with conversation history
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          conversation: tempConversation 
        })
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const text = await res.text()
      if (!text) {
        throw new Error('Empty response')
      }
      
      const data = JSON.parse(text)
      const aiMessage = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: data.response || 'Great question! What\'s your monthly income?' 
      }
      
      // Update both displays
      setMessages(prev => [...prev, aiMessage])
      setConversation(tempConversation.concat([{ role: 'ai', content: data.response }]))
      
    } catch (error) {
      console.error('Chat error:', error)
      const fallbackMessage = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: "Love helping with finance! 😊 What's your monthly income range or main financial goal?" 
      }
      setMessages(prev => [...prev, fallbackMessage])
    }
    
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
      <div className="h-[500px] overflow-y-auto space-y-4 mb-6 p-6 bg-white/70 rounded-2xl backdrop-blur-sm border border-white/60">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl text-sm shadow-lg backdrop-blur-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white'
                  : 'bg-white/95 text-gray-900 border border-gray-200/50'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What’s your financial goal? (savings, investing, debt...)"
          className="flex-1 px-5 py-4 bg-white/80 border-2 border-gray-200/60 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 outline-none transition-all shadow-lg backdrop-blur-sm text-gray-900 placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0.5 duration-200 min-w-[80px]"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
