import OnboardingChat from '@/components/OnboardingChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-emerald-900/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
  FinanceFlow
</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Your AI-powered financial copilot. Track, analyze, and grow your wealth effortlessly.
          </p>
        </div>
        
        <OnboardingChat />
      </div>
    </main>
  )
}
