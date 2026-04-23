// src/components/BrandingFooter.jsx
import React from 'react'

export default function BrandingFooter() {
  return (
    <footer className="w-full py-8 px-4 mt-auto border-t border-border/30 bg-base/50">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-faint text-[10px] uppercase tracking-[0.2em] font-medium">
          Digital Excellence by
        </p>
        <a 
          href="https://www.instagram.com/raheeldurwesh" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 transition-all duration-300"
        >
          <span className="text-mid font-display italic text-sm group-hover:text-amber transition-colors">
            Raheel Durwesh
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber/40 group-hover:bg-amber animate-pulse shadow-[0_0_8px_rgba(255,191,0,0.3)]" />
        </a>
      </div>
    </footer>
  )
}
