import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Zap } from 'lucide-react';
import Playground from './components/Playground';
import TechnicalSpecs from './components/TechnicalSpecs';

import logo from './assets/logo.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('playground');

  const particles = useMemo(() =>
    [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    })), []
  );

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-1 mb-6 px-3 py-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-sm"
          >
            <img src={logo} alt="Crovia Logo" className="w-5 h-5 object-contain" />
            <span className="text-sm text-primary-hover font-medium">Crovia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-display"
          >
            Empowering Farmers <br />
            <span className="text-gradient">
              Through Voice AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto font-light"
          >
            End-to-End Malayalam-to-English Translation —
            Breaking language barriers for agricultural knowledge access
          </motion.p>

          {/* Navigation Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex gap-2 p-1 bg-surface-glass rounded-full border border-white/10 backdrop-blur-md"
          >
            <button
              onClick={() => setActiveSection('playground')}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm ${activeSection === 'playground'
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Try Farmer Query
              </div>
            </button>
            <button
              onClick={() => setActiveSection('technical')}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm ${activeSection === 'technical'
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Technical Details
              </div>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'playground' ? <Playground /> : <TechnicalSpecs />}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20 py-8 bg-surface/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-600 text-xs mt-2">
            © 2025 Crovia Inc • Empowering farmers with multilingual access
          </p>
        </div>
      </footer>
    </div>
  );
}

