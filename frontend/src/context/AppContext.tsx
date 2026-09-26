import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { alerts } from '../data/alerts';
import { cases } from '../data/cases';
import { custodyEvents } from '../data/custodyEvents';
import { documents } from '../data/documents';
import { transfers as initialTransfers } from '../data/transfers';
import { users } from '../data/users';
import { verificationResults } from '../data/verification';
import { CustodyEvent, DocumentItem, DocumentStatus, IntegrityAlert, NyayaCase, Transfer, User } from '../types';

interface AppContextValue {
  users: User[];
  activeUser: User;
  selectedUser: User;
  setSelectedUser: (user: User) => void;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  cases: NyayaCase[];
  documents: DocumentItem[];
  transfers: Transfer[];
  custodyEvents: CustodyEvent[];
  alerts: IntegrityAlert[];
  verificationResults: typeof verificationResults;
  setTransfers: React.Dispatch<React.SetStateAction<Transfer[]>>;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setAlerts: React.Dispatch<React.SetStateAction<IntegrityAlert[]>>;
  setCustodyEvents: React.Dispatch<React.SetStateAction<CustodyEvent[]>>;
  setCases: React.Dispatch<React.SetStateAction<NyayaCase[]>>;
  setVerificationResults: React.Dispatch<React.SetStateAction<typeof verificationResults>>;
  simulateTamper: (documentId: string, versionId: string) => void;
  changeDocumentStatus: (documentId: string, status: DocumentStatus) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const SESSION_STORAGE_KEY = 'nyayachain-demo-session';

function getInitialSession(): { activeUser: User; isAuthenticated: boolean } {
  const defaultSession = { activeUser: users[0], isAuthenticated: false };
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedSession) return defaultSession;

  try {
    const parsed: unknown = JSON.parse(savedSession);
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid session');
    if (!('userId' in parsed) || !('name' in parsed) || !('role' in parsed)) throw new Error('Invalid session');
    const { userId, name, role } = parsed;
    const user = users.find((item) => item.id === userId && item.role === role);
    if (!user || typeof name !== 'string' || !name.trim()) throw new Error('Invalid session');
    return { activeUser: { ...user, name }, isAuthenticated: true };
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return defaultSession;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [initialSession] = useState(getInitialSession);
  const [activeUser, setActiveUserState] = useState<User>(initialSession.activeUser);
  const [selectedUser, setSelectedUser] = useState<User>(initialSession.activeUser);
  const [isAuthenticated, setIsAuthenticated] = useState(initialSession.isAuthenticated);
  const [allCases, setCases] = useState<NyayaCase[]>(cases);
  const [allDocuments, setDocuments] = useState<DocumentItem[]>(documents);
  const [allTransfers, setTransfers] = useState<Transfer[]>(initialTransfers);
  const [allEvents, setCustodyEvents] = useState<CustodyEvent[]>(custodyEvents);
  const [allAlerts, setAlerts] = useState<IntegrityAlert[]>(alerts);
  const [allVerificationResults, setVerificationResults] = useState<typeof verificationResults>(verificationResults);

  const signIn = useCallback((user: User) => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ userId: user.id, name: user.name, role: user.role }),
    );
    setActiveUserState(user);
    setSelectedUser(user);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setActiveUserState(users[0]);
    setSelectedUser(users[0]);
    setIsAuthenticated(false);
  }, []);

  const simulateTamper = (documentId: string, versionId: string) => {
    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === documentId
          ? {
              ...document,
              integrityStatus: 'RESTRICTED',
              currentVersion: versionId,
            }
          : document,
      ),
    );

    setAlerts((currentAlerts) => [
      {
        id: `alert-${Date.now()}`,
        caseId: 'HYD-CYB-2026-0147',
        documentId,
        versionId,
        title: 'Evidence_Statement_04.pdf',
        message: 'Hash mismatch detected',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        severity: 'HIGH',
      },
      ...currentAlerts,
    ]);

    setCustodyEvents((currentEvents) => [
      {
        id: `ce-${Date.now()}`,
        documentId,
        versionId,
        actorId: 'system',
        role: 'System',
        action: 'INTEGRITY_ALERT',
        timestamp: new Date().toISOString(),
        status: 'RESTRICTED',
        details: 'Hash mismatch detected.',
      },
      {
        id: `ce-${Date.now() + 1}`,
        documentId,
        versionId,
        actorId: 'system',
        role: 'System',
        action: 'VERSION_RESTRICTED',
        timestamp: new Date().toISOString(),
        status: 'RESTRICTED',
        details: 'Version restricted due to integrity verification failure.',
      },
      ...currentEvents,
    ]);

    setVerificationResults((currentResults) => [
      {
        id: `vr-${Date.now()}`,
        documentId,
        versionId,
        passed: false,
        status: 'RESTRICTED',
        verifiedAt: new Date().toISOString(),
        reason: 'SHA-256 mismatch',
      },
      ...currentResults,
    ]);
  };

  const changeDocumentStatus = (documentId: string, status: DocumentStatus) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === documentId ? { ...doc, integrityStatus: status } : doc)));
  };

  const value = useMemo<AppContextValue>(
    () => ({
      users,
      activeUser,
      selectedUser,
      setSelectedUser,
      isAuthenticated,
      signIn,
      signOut,
      cases: allCases,
      documents: allDocuments,
      transfers: allTransfers,
      custodyEvents: allEvents,
      alerts: allAlerts,
      verificationResults: allVerificationResults,
      setTransfers,
      setDocuments,
      setAlerts,
      setCustodyEvents,
      setCases,
      setVerificationResults,
      simulateTamper,
      changeDocumentStatus,
    }),
    [activeUser, selectedUser, allAlerts, allCases, allDocuments, allEvents, allTransfers, allVerificationResults, isAuthenticated, signIn, signOut],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppContext is missing');
  return context;
}
