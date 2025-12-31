'use client';

import { useState } from 'react';
import EntitySchemaEditor from '@/components/EntitySchemaEditor';

export default function Home() {
  const [view, setView] = useState<'home' | 'entities'>('home');

  if (view === 'entities') {
    return <EntitySchemaEditor onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Dynamic Entity System</h1>
        <p className="text-xl text-slate-300 mb-12">
          Crea entità configurabili con campi personalizzati, chat integrate e permessi granulari
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setView('entities')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-left transition-all hover:scale-105"
          >
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-2xl font-semibold mb-2">Editor Entità</h2>
            <p className="text-slate-300">
              Crea e configura schemi di entità con campi personalizzati
            </p>
          </button>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-left opacity-50">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold mb-2">Chat Integrate</h2>
            <p className="text-slate-300">Thread di discussione per ogni entità</p>
            <span className="text-xs text-slate-500 mt-2 block">Prossimamente</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-left opacity-50">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold mb-2">Ruoli & Permessi</h2>
            <p className="text-slate-300">Controllo granulare degli accessi</p>
            <span className="text-xs text-slate-500 mt-2 block">Prossimamente</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-left opacity-50">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold mb-2">Editor Viste</h2>
            <p className="text-slate-300">Personalizza la visualizzazione dei dati</p>
            <span className="text-xs text-slate-500 mt-2 block">Prossimamente</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-left opacity-50">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-slate-300">Visualizza e gestisci tutte le entità</p>
            <span className="text-xs text-slate-500 mt-2 block">Prossimamente</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-left opacity-50">
            <div className="text-4xl mb-4">🔄</div>
            <h2 className="text-2xl font-semibold mb-2">API & Integrazioni</h2>
            <p className="text-slate-300">Connetti con sistemi esterni</p>
            <span className="text-xs text-slate-500 mt-2 block">Prossimamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}

