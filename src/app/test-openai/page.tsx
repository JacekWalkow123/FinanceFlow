import OpenAI from 'openai'

export default async function OpenAITest() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  
  let status = '❌ NOT LOADED'
  let response = 'No response'
  let error = ''
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "FinanceFlow OpenAI WORKS!" in 5 words' }]
    })
    status = '✅ OPENAI WORKING!'
    response = completion.choices[0].message.content || 'No content'
  } catch (err: any) {
    status = '❌ FAILED'
    error = err.message || 'Unknown error'
  }

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">OpenAI Status Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500">
          <strong>Status:</strong> {status}
        </div>
        
        <div>
          <strong>API Key Loaded:</strong> {process.env.OPENAI_API_KEY ? '✅ YES' : '❌ NO'}
        </div>
        
        <div>
          <strong>Response:</strong>
          <pre className="mt-2 p-4 bg-gray-100 rounded-xl text-sm">{response}</pre>
        </div>
        
        <div className="text-red-600">
          <strong>Error:</strong> {error}
        </div>
        
        <div className="mt-8 p-6 bg-blue-50 border rounded-xl">
          <strong>Next Steps:</strong><br/>
          Visit <code className="bg-blue-200 px-2 py-1 rounded">localhost:3000/test-openai</code><br/>
          Green status = OpenAI ready → FinanceFlow LLM live<br/>
          Red status = Fix .env.local → Restart dev server
        </div>
      </div>
    </div>
  )
}
