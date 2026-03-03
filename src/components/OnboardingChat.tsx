'use client'

import { useState } from 'react'

type Step = {
  id: number
  question: string
  placeholder: string
  helper: string
}

const STEPS: Step[] = [
  {
    id: 1,
    question: 'What’s your main money goal?',
    placeholder: 'E.g. build emergency fund, invest, pay off debt…',
    helper: 'This helps FinanceFlow focus on the right area first.',
  },
  {
    id: 2,
    question: 'What’s your monthly take-home income?',
    placeholder: 'E.g. 3,000 EUR per month',
    helper: 'Rough numbers are fine, no need to be exact.',
  },
  {
    id: 3,
    question: 'How much can you put aside each month?',
    placeholder: 'E.g. 300 EUR per month',
    helper: 'We’ll use this to build a realistic plan.',
  },
]

export default function OnboardingChat({
  onComplete,
}: {
  onComplete?: (answers: Record<number, string>) => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentInput, setCurrentInput] = useState('')

  const step = STEPS[stepIndex]

  function handleNext() {
    const trimmed = currentInput.trim()
    if (!trimmed) return

    const updated = { ...answers, [step.id]: trimmed }
    setAnswers(updated)
    setCurrentInput('')

    if (stepIndex === STEPS.length - 1) {
      onComplete?.(updated)
    } else {
      setStepIndex(prev => prev + 1)
    }
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 shadow-xl space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-purple-300">
        Quick setup
      </div>
      <div className="text-sm font-medium text-white">{step.question}</div>
      <div className="text-xs text-slate-300">{step.helper}</div>

      <input
        value={currentInput}
        onChange={e => setCurrentInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleNext()
          }
        }}
        placeholder={step.placeholder}
        className="mt-2 w-full rounded-xl border border-white/20 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
      />

      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-400">
          Step {stepIndex + 1} of {STEPS.length}
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={!currentInput.trim()}
          className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1 text-[11px] font-semibold text-white shadow-md disabled:opacity-40"
        >
          {stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
