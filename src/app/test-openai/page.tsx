export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="max-w-md mx-auto h-screen flex flex-col pt-8 px-4"> {/* Mobile-first */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1">
          {/* Messages */}
        </div>
        
        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-slate-900/80 backdrop-blur-sm">
          <div className="chat-input-container relative">
            <input
              className="w-full p-4 pr-12 text-white bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-lg placeholder-gray-300 resize-none" // Mobile font-size
              placeholder="What's your money goal?"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-purple-400 hover:text-purple-200">
              ➤
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
