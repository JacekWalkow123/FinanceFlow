'use client'
import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const userId = '005a4d1e-d5c5-4110-941a-2a183d7a6b6f'

  const sendMessage = async () => {
    setLoading(true)
    setReply('Sending...')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId })
      })
      
      const data = await response.json()
      setReply(data.reply || 'No response')
    } catch (error) {
      setReply('Error: ' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '900', 
            background: 'linear-gradient(45deg, #10b981, #3b82f6)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0 
          }}>
            FinanceFlow
          </h1>
          <p style={{ color: '#d1d5db', marginTop: '0.5rem' }}>Test Chat</p>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '24px', 
          padding: '2rem', 
          border: '1px solid rgba(255,255,255,0.2)' 
        }}>
          <div style={{ 
            minHeight: '120px', 
            padding: '1rem', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '1.5rem',
            color: 'white',
            overflowY: 'auto'
          }}>
            {reply || <i style={{ opacity: 0.6 }}>Type your first command...</i>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="create household TestFamily"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              style={{
                padding: '1rem 2rem',
                background: loading ? '#059669' : '#10b981',
                color: 'white',
                fontWeight: '600',
                borderRadius: '16px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                minWidth: '100px'
              }}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Test Commands:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', color: '#10b981' }}>
              create household TestFamily
            </code>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', color: '#10b981' }}>
              €2000 salary
            </code>
            <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem', color: '#10b981' }}>
              €50 groceries
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
