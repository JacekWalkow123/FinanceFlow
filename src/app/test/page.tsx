'use client'
import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = '005a4d1e-d5c5-4110-941a-2a183d7a6b6f'

  const sendMessage = async () => {
    setLoading(true)
    setReply('')
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId })
    })
    
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          FinanceFlow Test
        </h1>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="min-h-[100px] p-4 bg-black/20 rounded-xl border border-white/30 mb-6 text-white">
            {reply || 'Start typing...'}
          </div>
          
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:border-emerald-400"
            placeholder="create household TestFamily"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
