import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()
    const profile = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', userId)
      .single()

    if (!profile.data?.household_id) {
      return NextResponse.json({ reply: "Say: 'create household TestFamily'" })
    }

    const householdId = profile.data.household_id
    const result = await parseCommand(message, householdId)
    
    if (result) return NextResponse.json({ reply: result })

    return NextResponse.json({ 
      reply: "💰 Household ready! Try: €50 groceries or 'Safe to spend?'" 
    })

  } catch (error) {
    return NextResponse.json({ reply: 'Error - check console' })
  }
}

async function parseCommand(message: string, householdId: string) {
  const msg = message.toLowerCase()
  const euroMatch = msg.match(/€?(\d+(?:\.\d{2})?)/)
  const amount = euroMatch ? parseFloat(euroMatch[1]) : 0

  // CREATE HOUSEHOLD
  if (msg.startsWith('create household')) {
    const name = message.replace(/create household/i, '').trim() || 'Family'
    const { data } = await supabase.from('households').insert({ name }).select('id').single()
    await supabase.from('profiles').update({ household_id: data!.id }).eq('id', householdId)
    return `✅ "${name}" created! Now try "€2000 salary"`
  }

  // TRANSACTIONS
  if (amount > 0) {
    const category = msg.includes('food') || msg.includes('grocery') ? 'groceries' :
                    msg.includes('salary') ? 'salary' : 'general'
    const type = msg.includes('salary') ? 'income' : 'expense'
    
    await supabase.from('transactions').insert({
      household_id: householdId,
      amount: type === 'income' ? amount : -amount,
      category, type, note: message
    })
    
    return `✅ €${amount} ${category} ${type}d.`
  }
}
