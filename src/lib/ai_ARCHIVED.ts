console.log('OPENAI_KEY:', process.env.OPENAI_API_KEY ? 'LOADED' : 'MISSING');
import OpenAI from 'openai'

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
})

export async function getFinanceFlowResponse(userMessage: string) {
  try {
    // Fallback financial knowledge (RAG simulation)
    const context = `Emergency fund: 3-6 months expenses ($1k starter goal). 
    High-yield savings: 4.5% APY 2026. Index funds: 7-10% annual returns. 
    Pay >7% interest debt first.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are FinanceFlow AI. Use this knowledge: ${context}. 
          Give practical 2-3 sentence advice. Ask about income, expenses, or goals.`
        },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 150
    })

    return response.choices[0].message.content!
  } catch (error) {
    console.error('OpenAI Error:', error)
    return "Great question! Start with $1k emergency fund. What's your monthly income? (Demo mode)"
  }
}
