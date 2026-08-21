import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { SignalsPage } from './pages/SignalsPage';
import { TrendingPage } from './pages/TrendingPage';
import { ServiceExplorer } from './components/ServiceExplorer';
import { BriefingsPage } from './pages/BriefingsPage';
import { AgentStatusTimeline } from './components/AgentStatusTimeline';
import { SignalDetailModal } from './components/SignalDetailModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { LandingPage } from './components/LandingPage';
import { 
  AWSSignal, 
  CommunityTopic, 
  DailyBriefing, 
  ServiceExplorerItem, 
  UserPreferences, 
  WhileYouWereAwaySummary,
  AgentExecutionLog 
} from './types/clientTypes';
import { 
  fetchAgentStatus, 
  fetchBriefings, 
  fetchLatestBriefing, 
  fetchPreferences, 
  fetchServicesExplorer, 
  fetchSignals, 
  fetchTrends, 
  fetchWhileYouWereAway, 
  toggleSaveSignal, 
  triggerAgentRun 
} from './services/apiClient';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Application Data States
  const [signals, setSignals] = useState<AWSSignal[]>([]);
  const [trends, setTrends] = useState<CommunityTopic[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [allBriefings, setAllBriefings] = useState<DailyBriefing[]>([]);
  const [services, setServices] = useState<ServiceExplorerItem[]>([]);
  const [summary, setSummary] = useState<WhileYouWereAwaySummary | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [latestLog, setLatestLog] = useState<AgentExecutionLog | null>(null);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [nextRun, setNextRun] = useState<string>('');

  // UI States
  const [selectedSignal, setSelectedSignal] = useState<AWSSignal | null>(null);
  const [showAlertSettings, setShowAlertSettings] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const loadAllData = async () => {
    try {
      const [
        statusRes,
        sigRes,
        trendsRes,
        briefingRes,
        allBriefingsRes,
        servicesRes,
        summaryRes,
        prefsRes,
      ] = await Promise.all([
        fetchAgentStatus().catch(() => null),
        fetchSignals().catch(() => ({ signals: [] })),
        fetchTrends().catch(() => []),
        fetchLatestBriefing().catch(() => null),
        fetchBriefings().catch(() => []),
        fetchServicesExplorer().catch(() => []),
        fetchWhileYouWereAway().catch(() => null),
        fetchPreferences().catch(() => null),
      ]);

      if (statusRes) {
        setIsAgentRunning(statusRes.is_running);
        setNextRun(statusRes.next_scheduled_run);
        setLatestLog(statusRes.latest_run);
      }

      setSignals(sigRes.signals || []);
      setTrends(trendsRes || []);
      setBriefing(briefingRes);
      setAllBriefings(allBriefingsRes);
      setServices(servicesRes || []);
      setSummary(summaryRes);
      setPreferences(prefsRes);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRunAgentNow = async () => {
    setIsAgentRunning(true);
    try {
      const res = await triggerAgentRun();
      setLatestLog(res.log);
      await loadAllData();
    } catch (err: any) {
      alert(`Agent run failed: ${err.message}`);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleToggleSave = async (id: string) => {
    try {
      const updated = await toggleSaveSignal(id);
      setSignals(prev => prev.map(s => s.signal_id === id ? updated : s));
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  const savedSignalsCount = signals.filter(s => s.is_saved).length;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'settings') {
            setShowAlertSettings(true);
          } else {
            setActiveTab(tab);
          }
        }}
        savedCount={savedSignalsCount}
        alertCount={summary?.high_priority_alerts ?? 1}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onRunAgent={handleRunAgentNow}
          isAgentRunning={isAgentRunning}
          searchTerm={globalSearch}
          onSearchChange={(val) => {
            setGlobalSearch(val);
            if (val && activeTab !== 'signals') {
              setActiveTab('signals');
            }
          }}
          onOpenSettings={() => setShowAlertSettings(true)}
        />

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'home' && (
            <Dashboard
              summary={summary}
              signals={signals}
              briefing={briefing}
              trends={trends}
              onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
              onToggleSave={handleToggleSave}
              onExploreSignals={() => setActiveTab('signals')}
            />
          )}

          {activeTab === 'signals' && (
            <SignalsPage
              signals={signals}
              onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
              onToggleSave={handleToggleSave}
            />
          )}

          {activeTab === 'saved' && (
            <SignalsPage
              signals={signals}
              onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
              onToggleSave={handleToggleSave}
              savedOnlyDefault={true}
            />
          )}

          {activeTab === 'trending' && (
            <TrendingPage trends={trends} />
          )}

          {activeTab === 'services' && (
            <ServiceExplorer
              services={services}
              onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activeTab === 'briefings' && (
            <BriefingsPage
              briefing={briefing}
              allBriefings={allBriefings}
              onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 font-rounded">
                    ✉ Intelligent SES Alert History
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Signals that triggered high-priority automated email alerts to {preferences?.email}.
                  </p>
                </div>
                <button
                  onClick={() => setShowAlertSettings(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Alert Settings
                </button>
              </div>

              <SignalsPage
                signals={signals.filter(s => s.signal_score >= 80)}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
                onToggleSave={handleToggleSave}
              />
            </div>
          )}

          {activeTab === 'demo' && (
            <AgentStatusTimeline
              latestLog={latestLog}
              isRunning={isAgentRunning}
              nextRun={nextRun}
              onRunNow={handleRunAgentNow}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <SignalDetailModal
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
      />

      {showAlertSettings && (
        <AlertSettingsModal
          preferences={preferences}
          onClose={() => setShowAlertSettings(false)}
          onUpdate={(updated) => setPreferences(updated)}
        />
      )}
    </div>
  );
}

export default App;
