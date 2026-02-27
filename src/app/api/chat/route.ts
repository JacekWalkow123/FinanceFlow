import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    const responses: Record<string, string> = {
      hi: "Hey! 👋 Love helping with money. What's your goal - saving, investing, or debt?",
      hello: "Hi there! 💰 What's your biggest money challenge right now?",
      savings: "Smart! Target **20% income** ($800 on $4k/mo). Ally HYSA pays **4.5% APY**. Monthly income range?",
      save: "Perfect start! **$1k emergency fund** first, then 3-6 months expenses. Current savings goal?",
      invest: "Awesome! **VTI index fund** beats 90% of pros (10% returns). **$200/mo = $250k in 30 years**. Timeline?",
      investing: "Love it! **401k match first** (free money), then VTI/S&P 500. Risk tolerance (low/med/high)?",
      debt: "Priority! **>7% interest first** (avalanche method). List your highest rate debt?",
      budget: "**50/30/20 rule**: 50% needs, 30% wants, 20% savings/debt. Monthly take-home pay?",
      emergency: "**3-6 months expenses** ($6k-$12k goal). Start $1k in HYSA. Monthly bills total?",
      help: "Happy to guide! Tell me: **savings**, **investing**, **debt**, or **budget**? Or share income!",
      default: `Smart question about "${message}"! My plan: 1) **$1k emergency** 2) **High-interest debt** 3) **Index funds**. Monthly income?`
    }
    
    const lowerMsg = message.toLowerCase().trim()
    let responseKey = 'default'
    
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        responseKey = key
        break
      }
    }
    
    return NextResponse.json({ 
      response: responses[responseKey as keyof typeof responses] 
    })
    
  } catch (error) {
    return NextResponse.json({ 
      response: "Hey! 💰 What's your main money goal right now?" 
    })
  }
}
