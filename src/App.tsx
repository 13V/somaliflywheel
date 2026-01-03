import React, { useState, useEffect } from 'react';
import { useFraudStats } from './hooks/useFraudStats';
const CRANKER_API = import.meta.env.VITE_CRANKER_API_URL || 'http://localhost:3001';

const App: React.FC = () => {
  const [isShredding, setIsShredding] = useState(false);
  const stats = useFraudStats();
  const [logs, setLogs] = useState<any[]>([
    { time: new Date().toLocaleTimeString(), msg: 'ACCESSED_NODE: Mainnet-Beta', status: 'OK' },
    { time: new Date().toLocaleTimeString(), msg: 'MONITORING_FRAUD_META_FLOW', status: 'ACTIVE' }
  ]);

  useEffect(() => {
    // We only update logs on real interactions now.
    // In a future update, this could listen to a websocket for on-chain events.
  }, []);

  const triggerShredder = async () => {
    if (stats.loading || isShredding) return;
    setIsShredding(true);

    try {
      const response = await fetch(`${CRANKER_API}/api/shred`, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        const shredEntry = {
          time: new Date().toLocaleTimeString(),
          msg: `SHRED_COMPLETE: ${data.signature.slice(0, 8)}...`,
          status: 'SHREDDED'
        };
        setLogs(prev => [shredEntry, ...prev]);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errorEntry = {
        time: new Date().toLocaleTimeString(),
        msg: `SHRED_FAILED: ${err.message || 'OFFLINE'}`,
        status: 'ERROR'
      };
      setLogs(prev => [errorEntry, ...prev]);
    } finally {
      setTimeout(() => setIsShredding(false), 2000);
    }
  };

  return (
    <div className="min-h-screen relative bg-forensic-dark pb-20 overflow-hidden">
      {/* Visual Overlays */}
      <div className="crt-overlay opacity-10"></div>

      {/* Industrial Header */}
      <header className="p-4 flex justify-between items-center border-b-2 border-slate-900 bg-black relative z-50">
        <div className="flex items-center gap-4">
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-forensic-caution font-black tracking-widest leading-none mb-1">UNCLASSIFIED // FOUO</span>
            <h2 className="text-xl italic font-black tracking-tighter">SOMALI FLYWHEEL</h2>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
            <span className="cursor-help hover:text-forensic-caution transition-colors">Case.Files_v3</span>
            <span className="cursor-help hover:text-forensic-caution transition-colors">Audit_Log</span>
            <span className="cursor-help hover:text-forensic-caution transition-colors">Authorities</span>
          </div>
          <button className="btn-forensic text-xs py-1.5 px-4 font-black">CONNECT_NODE</button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Brutalist Hero / Monitor Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-8 terminal-panel bg-slate-950/50 flex flex-col justify-center min-h-[400px] border-l-4 border-l-forensic-caution">
            <div className="mb-4 flex gap-2">
              <span className="bg-forensic-caution text-black text-[10px] font-black px-2 py-0.5">PRIORITY_ALPHA</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">Location: MN_DAYCARE_SECTOR</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter italic mb-4">
              <span className="text-white font-mono">$SOMALIFW</span>
              <br />
              <span className="text-forensic-caution">FLYWHEEL</span>
            </h1>
            <div className="max-w-xl">
              <p className="text-sm font-bold text-slate-200 uppercase tracking-widest leading-relaxed mb-8">
                Official protocol for the <span className="text-white redacted">Somali Daycare Meta</span>.
                We intercept trading fees and <span className="text-white">SHRED THE EVIDENCE</span> through
                automated buyback-and-burn cycles. No AI. Just raw on-chain forensics.
              </p>
              <div className="flex">
                <a
                  href={`https://dexscreener.com/solana/${import.meta.env.VITE_FRAUD_MINT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-8 border-2 border-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center"
                >
                  DEEP_SCAN_DEX
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <div className="terminal-panel flex flex-col justify-center border-t-4 border-t-forensic-caution">
              <h3 className="text-xs text-slate-300 mb-4 opacity-70 uppercase tracking-[0.2em]">Live_Market_Cap</h3>
              <div className="text-5xl md:text-6xl font-black italic tracking-tighter text-white">
                {stats.loading ? '???' : `$${(stats.marketCap / 1000).toFixed(1)}K`}
              </div>
              <div className="mt-4 text-[10px] font-bold text-forensic-caution flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stats.loading ? 'bg-slate-700' : 'bg-forensic-caution animate-ping'}`}></div>
                {stats.loading ? 'SCANNING_NODE...' : 'SIGNAL_CONFIRMED // STABLE'}
              </div>
            </div>
            <div className="terminal-panel flex flex-col justify-center">
              <h3 className="text-xs text-slate-300 mb-4 opacity-70 uppercase tracking-[0.2em]">Total_Laundered</h3>
              <div className="text-5xl md:text-6xl font-black italic tracking-tighter text-white">
                {stats.loading ? '???' : stats.totalLaundered > 1000000
                  ? `${(stats.totalLaundered / 1000000).toFixed(1)}M`
                  : `${(stats.totalLaundered / 1000).toFixed(0)}K`} <span className="text-sm not-italic opacity-30">$SOMALIFW</span>
              </div>
              <div className="mt-4 text-[10px] font-bold text-slate-200 uppercase tracking-widest">
                {stats.error || 'Protocol: Burn_Execution_Confirmed'}
              </div>
            </div>
          </div>
        </section>

        {/* The Action Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* The Shredder */}
          <div className="terminal-panel border-2 border-forensic-caution/40 bg-black flex flex-col items-center justify-center py-16">
            <div className={`w-40 h-40 border-4 border-slate-900 flex items-center justify-center mb-8 relative ${isShredding ? 'bg-forensic-caution/10' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" className={`w-20 h-20 ${isShredding ? 'animate-pulse text-forensic-caution' : 'text-slate-800'}`} stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2 className="text-3xl mb-2 italic font-black text-white">THE DIGITAL SHREDDER</h2>
            <p className="text-[11px] text-center font-bold text-slate-300 uppercase tracking-widest mb-8 max-w-xs">
              Automated execution of $SOMALIFW buybacks. Irreversible evidence deletion protocol.
            </p>
            <button
              onClick={triggerShredder}
              disabled={isShredding}
              className={`w-full max-w-xs py-4 font-black ${isShredding ? 'bg-slate-950 border-slate-900 text-slate-800 cursor-not-allowed' : 'btn-forensic'}`}
            >
              {isShredding ? 'DELETING_EVIDENCE...' : 'SHRED_SOMALIFW'}
            </button>
          </div>

          {/* Detailed Logs / Scan Zone */}
          <div className="terminal-panel bg-slate-950">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black italic tracking-tighter text-white">SURVEILLANCE_LOGS</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">LIVE_FEED_v2.0.4</span>
            </div>
            <div className="space-y-4 font-mono text-[11px] text-slate-200">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 border-b border-slate-900 pb-2">
                  <span className="text-forensic-caution opacity-80">{log.time}</span>
                  <span className="flex-1 uppercase tracking-[0.15em] font-bold">{log.msg}</span>
                  <span className={`font-black ${log.status === 'OK' ? 'text-green-400' : log.status === 'SHREDDED' ? 'text-red-400' : 'text-slate-400'}`}>[{log.status}]</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 border-2 border-dashed border-slate-800 text-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">WAITING_FOR_SIGNAL</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t-2 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-md">
            NOTICE: Somali Flywheel is an autonomous protocol. All subsidies claimed are final. Trading involves extreme risk of total evidence deletion.
          </div>
          <div className="flex gap-4">
            <span className="redacted px-3 py-1 text-[10px] font-black text-black">CLASSIFIED</span>
            <span className="redacted px-3 py-1 text-[10px] font-black text-black">TOP_SECRET</span>
            <span className="redacted px-3 py-1 text-[10px] font-black text-black">NO_FORN</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
