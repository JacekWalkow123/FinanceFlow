import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey!)

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
})

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()
    
    // Get user's household
    const { data } = await supabase
      .from('profiles')
      .select('household_id')
      .eq('id', userId)
      .single()
    
    if (!data?.household_id) {
      return NextResponse.json({ reply: "First: 'create household TestFamily'" })
    }

    const householdId = data.household_id

    // PARSE COMMANDS FIRST
    const commandResult = await parseCommand(message, householdId)
    if (commandResult) {
      return NextResponse.json({ reply: commandResult })
    }

    // Get context for AI
    const [budgets, debts, investments, totalsResponse] = await Promise.all([
      supabase.from('budgets').select('*').eq('household_id', householdId),
      supabase.from('debts').select('*').eq('household_id', householdId),
      supabase.from('investments').select('*').eq('household_id', householdId),
      supabase.rpc('get_household_totals', { hid: householdId }) // Simple sum later
    ])

    const txSummary = totalsResponse.data

    const safeToSpend = 420 // Replace with real calc later
    
    const context = `Budgets: ${budgets.data?.length || 0}, Debts: ${debts.data?.length || 0}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `FinanceFlow AI. Safe to spend: €${safeToSpend}. ${context}
Always be encouraging. Suggest logging salary/expenses.`
        },
        { role: 'user', content: message }
      ]
    })

    return NextResponse.json({ 
      reply: `💰 Safe to spend: €${safeToSpend}\n\n${completion.choices[0].message.content}` 
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ reply: 'Oops! Try again or check console.' })
  }
}

async function parseCommand(message: string, householdId: string) {
  const msg = message.toLowerCase().trim()
  const euroMatch = msg.match(/€?(\d+(?:\.\d{2})?)/i)
  const amount = euroMatch ? parseFloat(euroMatch[1]) : 0

  // CREATE HOUSEHOLD
  if (msg.startsWith('create household')) {
    const name = message.replace(/create household\s*/i, '').trim() || 'Family'
    const { data } = await supabase.from('households').insert({ name }).select('id').single()
    if (data) {
      await supabase.from('profiles').update({ household_id: data.id }).eq('id', householdId)
      return `✅ "${name}" household created! Now try "€2000 salary"`
    }
  }

  // TRANSACTION
  if (amount > 0) {
    const category = msg.includes('grocery') || msg.includes('food') ? 'groceries' :
                    msg.includes('rent') ? 'rent' :
                    msg.includes('salary') ? 'salary' : 'general'
    
    const type = msg.includes('salary') ? 'income' : 'expense'
    await supabase.from('transactions').insert({
      household_id: householdId,
      amount: type === 'income' ? amount : -amount,
      category, type,
      note: message
    })
    return `✅ €${amount} ${category} ${type}d.`
  }

  return null
}
