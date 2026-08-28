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
    <div className="space-y-6 font-mono text-on-background pb-12">
      {/* Service Selector Chips */}
      <div className="bg-surface rounded-3xl border border-outline p-4 sm:p-6 shadow-sm">
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
          Select AWS Service to Explore
        </h2>
        <div className="flex flex-wrap gap-2">
          {services.map((srv) => (
            <button
              key={srv.service_name}
              onClick={() => setSelectedServiceName(srv.service_name)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                selectedServiceName === srv.service_name
                  ? 'btn-geu-primary text-white shadow-purple-glow'
                  : 'bg-surface-low hover:bg-surface-container text-on-surface-variant hover:text-on-background border border-outline'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{srv.service_name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedServiceName === srv.service_name ? 'bg-white/20 text-white' : 'bg-surface text-on-surface-variant'
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
          <div className="bg-surface border border-outline text-on-background rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                  AWS Cloud Mesh Intelligence
                </span>
                <h1 className="text-xl sm:text-3xl font-black font-display text-on-background uppercase tracking-tight">
                  {activeService.service_name}
                </h1>
                <p className="text-on-surface-variant text-xs sm:text-sm mt-1 font-sans">
                  Monitoring {activeService.signal_count} active intelligence signals and community discussions.
                </p>
              </div>

              <div className="bg-surface-low border border-outline p-4 rounded-2xl text-center shrink-0">
                <span className="text-[10px] text-on-surface-variant font-bold block uppercase tracking-wider">Avg Score</span>
                <span className="text-2xl font-black text-primary">{activeService.avg_signal_score}/100</span>
              </div>
            </div>
          </div>

          {/* Service Recent Signals List */}
          <div>
            <h3 className="text-base font-bold text-on-background mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Radio className="w-4 h-4 text-primary" />
              Recent Signals for {activeService.service_name}
            </h3>

            {activeService.recent_signals.length === 0 ? (
              <div className="bg-surface rounded-3xl border border-outline p-8 text-center text-on-surface-variant">
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
