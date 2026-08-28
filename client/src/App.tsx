import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  AWSSignal, 
  CommunityTopic, 
  DailyBriefing, 
  ServiceExplorerItem, 
  UserPreferences, 
  UserProfile, 
  WhileYouWereAwaySummary,
  AgentExecutionLog 
} from './types/clientTypes';
import { 
  fetchSignals, 
  fetchTrends, 
  fetchLatestBriefing, 
  fetchBriefings, 
  fetchServicesExplorer, 
  fetchWhileYouWereAway, 
  fetchPreferences, 
  fetchActiveProfile, 
  fetchAgentStatus, 
  triggerAgentRun, 
  toggleSaveSignal,
  getLocalSavedIds
} from './services/apiClient';

import { LandingPage } from './components/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { SignalsPage } from './pages/SignalsPage';
import { TrendingPage } from './pages/TrendingPage';
import { BriefingsPage } from './pages/BriefingsPage';
import { ServiceExplorer } from './components/ServiceExplorer';
import { AgentStatusTimeline } from './components/AgentStatusTimeline';
import { SignalDetailModal } from './components/SignalDetailModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { BuilderIdAuthModal } from './components/BuilderIdAuthModal';
import { NotFoundPage } from './pages/NotFoundPage';
import { Sidebar, MobileBottomNav } from './components/Sidebar';
import { Header } from './components/Header';
import { SignalCard } from './components/SignalCard';
import { ThemeProvider } from './context/ThemeContext';
import { Bookmark, KeyRound, ArrowRight } from 'lucide-react';

import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}

function SignalDirectRoute({
  signals,
  onOpenDetail,
  onToggleSave,
}: {
  signals: AWSSignal[];
  onOpenDetail: (sig: AWSSignal) => void;
  onToggleSave: (id: string) => void;
}) {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id && signals.length > 0) {
      const match = signals.find(s => s.signal_id === id);
      if (match) {
        onOpenDetail(match);
      }
    }
  }, [id, signals, onOpenDetail]);

  return (
    <SignalsPage
      signals={signals}
      onOpenSignalDetail={onOpenDetail}
      onToggleSave={onToggleSave}
    />
  );
}

function MainLayout({
  children,
  savedCount,
  alertCount,
  userProfile,
  onOpenAuthModal,
  onOpenSettings,
  onRunAgent,
  isAgentRunning,
  globalSearch,
  setGlobalSearch,
}: {
  children: React.ReactNode;
  savedCount: number;
  alertCount: number;
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenSettings: () => void;
  onRunAgent: () => void;
  isAgentRunning: boolean;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans transition-colors overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar
        savedCount={savedCount}
        alertCount={alertCount}
        userProfile={userProfile}
        onOpenAuthModal={onOpenAuthModal}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onRunAgent={onRunAgent}
          isAgentRunning={isAgentRunning}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenSettings={onOpenSettings}
          userProfile={userProfile}
          onOpenAuthModal={onOpenAuthModal}
        />

        <main className="p-3.5 sm:p-6 md:p-8 pb-32 md:pb-12 max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Touch Bottom Navigation */}
      <MobileBottomNav
        alertCount={alertCount}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const [signals, setSignals] = useState<AWSSignal[]>([]);
  const [trends, setTrends] = useState<CommunityTopic[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [allBriefings, setAllBriefings] = useState<DailyBriefing[]>([]);
  const [services, setServices] = useState<ServiceExplorerItem[]>([]);
  const [summary, setSummary] = useState<WhileYouWereAwaySummary | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [nextRun, setNextRun] = useState<string>('Every hour (EventBridge)');
  const [latestLog, setLatestLog] = useState<AgentExecutionLog | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedSignal, setSelectedSignal] = useState<AWSSignal | null>(null);
  const [showAlertSettings, setShowAlertSettings] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const loadAllData = useCallback(async (activeBuilderId?: string) => {
    try {
      const profile = await fetchActiveProfile().catch(() => null);
      if (profile) setUserProfile(profile);

      const bId = activeBuilderId || profile?.builder_id || 'guest';

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
        fetchSignals({ builderId: bId }).catch(() => ({ signals: [] })),
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
  }, []);

  // Initial load and background auto-fetcher (every 30 seconds + on tab focus)
  useEffect(() => {
    loadAllData();

    const interval = setInterval(() => {
      loadAllData();
    }, 30000); // Auto-fetch every 30 seconds

    const handleFocus = () => {
      loadAllData();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        loadAllData();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadAllData]);

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
    if (!userProfile?.is_authenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const updated = await toggleSaveSignal(id, userProfile.builder_id);
      setSignals(prev => prev.map(s => s.signal_id === id ? { ...s, is_saved: updated.is_saved } : s));
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const currentSavedIds = new Set(getLocalSavedIds(userProfile?.is_authenticated ? userProfile.builder_id : 'guest'));
  const savedSignalsCount = userProfile?.is_authenticated ? signals.filter(s => currentSavedIds.has(s.signal_id)).length : 0;

  return (
    <>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
            <LandingPage 
              onGetStarted={() => navigate('/dashboard')} 
              onOpenAuthModal={() => setShowAuthModal(true)}
            />
          } 
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <Dashboard
                summary={summary}
                signals={signals}
                briefing={briefing}
                trends={trends}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
                onToggleSave={handleToggleSave}
                onExploreSignals={() => navigate('/signals')}
              />
            </MainLayout>
          }
        />

        {/* Signals Stream Route */}
        <Route
          path="/signals"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <SignalsPage
                signals={signals}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
                onToggleSave={handleToggleSave}
              />
            </MainLayout>
          }
        />

        <Route
          path="/signals/:id"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <SignalDirectRoute
                signals={signals}
                onOpenDetail={(sig) => setSelectedSignal(sig)}
                onToggleSave={handleToggleSave}
              />
            </MainLayout>
          }
        />

        {/* Personal Bookmarks Vault Route */}
        <Route
          path="/saved"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              {!userProfile?.is_authenticated ? (
                <div className="bg-white dark:bg-[#121216] rounded-xl border border-slate-200 dark:border-zinc-800 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                      Sign in to View Your Vault
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-normal leading-relaxed">
                      Authenticate with your AWS Builder ID handle to save articles, sync custom topics, and manage bookmarked signals.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer"
                  >
                    <span>Sign in with Builder ID</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <SignalsPage
                  signals={signals.filter(s => currentSavedIds.has(s.signal_id))}
                  onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
                  onToggleSave={handleToggleSave}
                  savedOnlyDefault={true}
                />
              )}
            </MainLayout>
          }
        />

        {/* Friction Matrix Route */}
        <Route
          path="/trending"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <TrendingPage trends={trends} />
            </MainLayout>
          }
        />

        {/* Cloud Mesh Route */}
        <Route
          path="/services"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <ServiceExplorer
                services={services}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
              />
            </MainLayout>
          }
        />

        {/* Daily Briefings Route */}
        <Route
          path="/briefings"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <BriefingsPage
                briefing={briefing}
                allBriefings={allBriefings}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
              />
            </MainLayout>
          }
        />

        {/* Intelligent SES Alerts History Route */}
        <Route
          path="/alerts"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                      Intelligent SES Alert History
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
                      High-priority signals (score ≥ 80) dispatched via Amazon SES to {userProfile?.is_authenticated ? userProfile.email : 'subscribed Builder IDs'}.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAlertSettings(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm cursor-pointer"
                  >
                    Alert Settings
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {signals.filter(s => s.signal_score >= 80).map((sig) => (
                    <div key={sig.signal_id} className="relative">
                      <SignalCard
                        signal={sig}
                        onOpenDetail={(s) => setSelectedSignal(s)}
                        onToggleSave={handleToggleSave}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MainLayout>
          }
        />

        {/* Telemetry Route */}
        <Route
          path="/telemetry"
          element={
            <MainLayout
              savedCount={savedSignalsCount}
              alertCount={summary?.high_priority_alerts ?? 1}
              userProfile={userProfile}
              onOpenAuthModal={() => setShowAuthModal(true)}
              onOpenSettings={() => setShowAlertSettings(true)}
              onRunAgent={handleRunAgentNow}
              isAgentRunning={isAgentRunning}
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
            >
              <AgentStatusTimeline
                latestLog={latestLog}
                isRunning={isAgentRunning}
                nextRun={nextRun}
                onRunNow={handleRunAgentNow}
              />
            </MainLayout>
          }
        />

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Modals */}
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

      {showAuthModal && (
        <BuilderIdAuthModal
          currentProfile={userProfile}
          onClose={() => setShowAuthModal(false)}
          onSuccess={(profile) => {
            setUserProfile(profile);
            loadAllData(profile.builder_id);
          }}
        />
      )}
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
