// src/components/DemoBanner.jsx
import React from 'react'

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-amber/30 via-amber/10 to-amber/30 
                    border-b border-amber/40 px-4 py-3 relative overflow-hidden group">
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl animate-bounce">🌟</span>
          <div>
            <p className="text-bright text-sm font-display font-bold tracking-wide">
              You are exploring the <span className="text-amber">Shared Sandbox</span>
            </p>
            <p className="text-mid text-xs italic">
              Like what you see? Get your own private, secure instance today.
            </p>
          </div>
        </div>
        
        <a 
          href="https://wa.me/919359300613" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-amber py-1.5 px-5 text-xs shadow-lg shadow-amber/20 
                     flex items-center gap-2 hover:scale-105 transition-all"
        >
          <span>Contact Raheel Durwesh</span>
          <span className="text-lg">→</span>
        </a>
      </div>
    </div>
  )
}
