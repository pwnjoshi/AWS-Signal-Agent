import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { Sidebar, MobileBottomNav } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { SignalsPage } from './pages/SignalsPage';
import { TrendingPage } from './pages/TrendingPage';
import { ServiceExplorer } from './components/ServiceExplorer';
import { BriefingsPage } from './pages/BriefingsPage';
import { AgentStatusTimeline } from './components/AgentStatusTimeline';
import { SignalDetailModal } from './components/SignalDetailModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { BuilderIdAuthModal } from './components/BuilderIdAuthModal';
import { LandingPage } from './components/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';
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
  fetchActiveProfile,
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

function SignalDirectRoute({ 
  signals, 
  onOpenDetail, 
  onToggleSave 
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 font-sans transition-colors">
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

        <main className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full flex-1">
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

  // Profile & Auth State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

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
        profileRes,
      ] = await Promise.all([
        fetchAgentStatus().catch(() => null),
        fetchSignals().catch(() => ({ signals: [] })),
        fetchTrends().catch(() => []),
        fetchLatestBriefing().catch(() => null),
        fetchBriefings().catch(() => []),
        fetchServicesExplorer().catch(() => []),
        fetchWhileYouWereAway().catch(() => null),
        fetchPreferences().catch(() => null),
        fetchActiveProfile().catch(() => null),
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
      setUserProfile(profileRes);
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

  const savedSignalsCount = signals.filter(s => s.is_saved).length;

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

        {/* Dashboard & App Routes inside Layout */}
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
              <SignalsPage
                signals={signals}
                onOpenSignalDetail={(sig) => setSelectedSignal(sig)}
                onToggleSave={handleToggleSave}
                savedOnlyDefault={true}
              />
            </MainLayout>
          }
        />

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-on-background font-display uppercase tracking-tight flex items-center gap-2">
                      <span>Intelligent SES Alert History</span>
                    </h1>
                    <p className="text-on-surface-variant text-xs sm:text-sm mt-1">
                      Signals that triggered high-priority automated email alerts to {userProfile?.builder_id || 'your profile'}.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAlertSettings(true)}
                    className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
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
            </MainLayout>
          }
        />

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
            loadAllData();
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
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
