// src/components/DemoGuide.jsx
import React, { useState } from 'react'

export default function DemoGuide() {
  const [isOpen, setIsOpen] = useState(false)

  const steps = [
    { 
      icon: '📱', 
      title: 'Phase 1: Experience', 
      text: 'Open /demo-cafe in a new tab. Note the premium Gold & Onyx theme for customers.' 
    },
    { 
      icon: '⚡', 
      title: 'Phase 2: The Magic', 
      text: 'Place an order on your phone. It will pop up here instantly—no refresh needed!' 
    },
    { 
      icon: '🔄', 
      title: 'Phase 3: Real-time Sync', 
      text: 'Change status to "Preparing". If you open /demo-cafe/waiter, it updates there too.' 
    },
    { 
      icon: '📊', 
      title: 'Phase 4: Sales Intelligence', 
      text: 'Switch to the "Analytics" tab to see your test order reflected in the revenue charts.' 
    },
    { 
      icon: '📄', 
      title: 'Phase 5: Professionalism', 
      text: 'Click the Invoice icon on any order to generate a branded PDF receipt.' 
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div className="flex flex-col items-end gap-3">
        {/* The Card */}
        {isOpen && (
          <div className="pointer-events-auto w-64 xs:w-72 bg-base/95 backdrop-blur-2xl border border-amber/40 
                        rounded-2xl shadow-2xl p-4 animate-slide-up overflow-hidden relative border-t-amber/60">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber/10 blur-3xl -z-10" />
            
            <div className="flex justify-between items-center border-b border-border/50 mb-4 pb-2">
              <div>
                <h3 className="text-amber font-display font-bold text-[11px] tracking-widest uppercase">System Tour</h3>
                <p className="text-[8px] text-amber/60 uppercase font-body mt-0.5 font-bold tracking-tighter">Master TableServe</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-5 w-5 flex items-center justify-center rounded-full bg-raised text-bright hover:bg-amber hover:text-black transition-all text-xs border border-border"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
              {steps.map((s, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div className="h-8 w-8 shrink-0 bg-raised rounded-lg flex items-center justify-center text-base
                                border border-border/50 group-hover:border-amber/50 transition-colors shadow-sm">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-bright text-[11px] font-bold font-body">{s.title}</h4>
                    <p className="text-mid text-[9.5px] leading-snug mt-1 font-medium group-hover:text-bright transition-colors">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2.5">
              <a 
                href="/demo-cafe" 
                target="_blank" 
                className="btn-amber w-full py-2.5 text-[9px] flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-lg shadow-amber/20"
              >
                Start Customer Demo <span>↗</span>
              </a>
              <div className="px-2 py-2 bg-black/40 border border-amber/20 rounded-lg">
                <p className="text-[8px] text-amber/90 text-center leading-tight">
                  🔒 <span className="font-bold italic">Safety Lock:</span> Destructive actions disabled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center relative group
                     ${isOpen ? 'bg-raised h-10 w-10 border border-border mt-3' : 'bg-amber h-14 w-14 shadow-amber/30 text-2xl'}`}
        >
          {isOpen ? <span className="text-bright">×</span> : '💡'}
          {!isOpen && (
            <span className="absolute right-16 px-4 py-2 bg-amber text-black text-xs 
                           font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity
                           whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl">
              How to use?
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
