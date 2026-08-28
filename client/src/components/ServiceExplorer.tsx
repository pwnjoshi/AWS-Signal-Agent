import React, { useState } from 'react';
import { ServiceExplorerItem, AWSSignal } from '../types/clientTypes';
import { Radio, Cloud } from 'lucide-react';
import { SignalCard } from './SignalCard';

interface ServiceExplorerProps {
  services: ServiceExplorerItem[];
  onOpenSignalDetail: (signal: AWSSignal) => void;
}

export const ServiceExplorer: React.FC<ServiceExplorerProps> = ({ services, onOpenSignalDetail }) => {
  const [selectedServiceName, setSelectedServiceName] = useState<string>(
    services[0]?.service_name || 'Amazon Bedrock'
  );

  const activeService = services.find(s => s.service_name === selectedServiceName) || services[0];

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-zinc-100 pb-12">
      {/* Service Selector Chips */}
      <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm transition-colors">
        <h2 className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-3">
          Select AWS Service to Explore
        </h2>
        <div className="flex flex-wrap gap-2">
          {services.map((srv) => (
            <button
              key={srv.service_name}
              onClick={() => setSelectedServiceName(srv.service_name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedServiceName === srv.service_name
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#202026] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 border border-slate-200 dark:border-zinc-700'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{srv.service_name}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedServiceName === srv.service_name ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#202026] text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
              }`}>
                {srv.signal_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Service Detail Header */}
      {activeService && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                  {activeService.service_name}
                </h1>
                <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5 font-normal">
                  Monitoring {activeService.signal_count} active intelligence signals and discussions.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 p-3 rounded-lg text-center shrink-0 font-mono">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold block uppercase tracking-wider">Avg Score</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeService.avg_signal_score}/100</span>
              </div>
            </div>
          </div>

          {/* Service Recent Signals List */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mb-3.5">
              Recent Signals for {activeService.service_name}
            </h3>

            {activeService.recent_signals.length === 0 ? (
              <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-8 text-center text-slate-600 dark:text-zinc-400">
                No recent signals logged for this service yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeService.recent_signals.map((sig) => (
                  <SignalCard 
                    key={sig.signal_id} 
                    signal={sig} 
                    onOpenDetail={onOpenSignalDetail} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ServiceExplorer;
