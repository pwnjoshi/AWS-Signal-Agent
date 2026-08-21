import React, { useState } from 'react';
import { ServiceExplorerItem, AWSSignal } from '../types/clientTypes';
import { Cpu, Radio, Sparkles, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Service Selector Chips */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Select AWS Service to Explore
        </h2>
        <div className="flex flex-wrap gap-2">
          {services.map((srv) => (
            <button
              key={srv.service_name}
              onClick={() => setSelectedServiceName(srv.service_name)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
                selectedServiceName === srv.service_name
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{srv.service_name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedServiceName === srv.service_name ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {srv.signal_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Service Detail Header */}
      {activeService && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider block mb-1">
                  AWS Service Intelligence
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeService.service_name}
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                  Monitoring {activeService.signal_count} active intelligence signals and community discussions.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center shrink-0">
                <span className="text-xs text-slate-300 font-bold block uppercase">Avg Signal Score</span>
                <span className="text-3xl font-extrabold text-blue-400">{activeService.avg_signal_score}/100</span>
              </div>
            </div>
          </div>

          {/* Service Recent Signals List */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" />
              Recent Signals for {activeService.service_name}
            </h3>

            {activeService.recent_signals.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
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
