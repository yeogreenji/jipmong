import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  Complex,
  DiaryEntry,
  DreamHomeProfile,
  FinancePlan,
  SavingsRecord,
} from './types';
import { DEFAULT_FINANCE, STORAGE_KEYS, loadArray, loadJson, saveJson } from './lib/storage';
import { DEFAULT_PROFILE } from './data/options';
import { SAMPLE_COMPLEXES } from './data/complexes';
import { findCandidates, profileCompletion, type Candidate } from './lib/match';
import { summarizeFinance, type FinanceSummary } from './lib/calc';

interface StoreValue {
  profile: DreamHomeProfile;
  updateProfile: (patch: Partial<DreamHomeProfile>) => void;
  resetProfile: () => void;
  markProfileSaved: () => void;

  finance: FinancePlan;
  updateFinance: (patch: Partial<FinancePlan>) => void;
  summary: FinanceSummary;

  savings: SavingsRecord[];
  addSaving: (record: Omit<SavingsRecord, 'id'>) => void;
  removeSaving: (id: string) => void;

  diary: DiaryEntry[];
  addDiary: (entry: Omit<DiaryEntry, 'id'>) => void;
  removeDiary: (id: string) => void;

  contractChecks: Record<string, boolean>;
  toggleContract: (id: string) => void;
  resetContract: () => void;

  visitChecks: Record<string, boolean>;
  toggleVisit: (id: string) => void;
  visitMemos: Record<string, string>;
  setVisitMemo: (id: string, memo: string) => void;

  candidates: Candidate[];
  savedComplexes: Complex[];
  toggleSavedComplex: (id: string) => void;

  completion: number;

  notice: string | null;
  notify: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DreamHomeProfile>(() =>
    loadJson<DreamHomeProfile>(STORAGE_KEYS.profile, DEFAULT_PROFILE),
  );
  const [finance, setFinance] = useState<FinancePlan>(() =>
    loadJson<FinancePlan>(STORAGE_KEYS.finance, DEFAULT_FINANCE),
  );
  const [savings, setSavings] = useState<SavingsRecord[]>(() =>
    loadArray<SavingsRecord>(STORAGE_KEYS.savings),
  );
  const [diary, setDiary] = useState<DiaryEntry[]>(() =>
    loadArray<DiaryEntry>(STORAGE_KEYS.diary),
  );
  const [contractChecks, setContractChecks] = useState<Record<string, boolean>>(() =>
    loadJson<Record<string, boolean>>(STORAGE_KEYS.contractChecks, {}),
  );
  const [visitChecks, setVisitChecks] = useState<Record<string, boolean>>(() =>
    loadJson<Record<string, boolean>>(STORAGE_KEYS.visitChecks, {}),
  );
  const [visitMemos, setVisitMemos] = useState<Record<string, string>>(() =>
    loadJson<Record<string, string>>(STORAGE_KEYS.visitMemos, {}),
  );
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | null>(null);

  // 저장은 항상 이 브라우저 안에서만 일어납니다. 서버로 보내지 않습니다.
  useEffect(() => {
    saveJson(STORAGE_KEYS.profile, profile);
  }, [profile]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.finance, finance);
  }, [finance]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.savings, savings);
  }, [savings]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.diary, diary);
  }, [diary]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.contractChecks, contractChecks);
  }, [contractChecks]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.visitChecks, visitChecks);
  }, [visitChecks]);
  useEffect(() => {
    saveJson(STORAGE_KEYS.visitMemos, visitMemos);
  }, [visitMemos]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const notify = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  }, []);

  const updateProfile = useCallback((patch: Partial<DreamHomeProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  const markProfileSaved = useCallback(() => {
    setProfile((prev) => ({ ...prev, updatedAt: new Date().toISOString() }));
  }, []);

  const updateFinance = useCallback((patch: Partial<FinancePlan>) => {
    setFinance((prev) => ({ ...prev, ...patch }));
  }, []);

  const addSaving = useCallback((record: Omit<SavingsRecord, 'id'>) => {
    const amount = Math.max(0, Math.round(record.amountManwon));
    setSavings((prev) => [{ ...record, amountManwon: amount, id: makeId('save') }, ...prev]);
    setFinance((prev) => ({ ...prev, currentFundsManwon: prev.currentFundsManwon + amount }));
  }, []);

  const removeSaving = useCallback((id: string) => {
    setSavings((prev) => {
      const target = prev.find((record) => record.id === id);
      if (target) {
        setFinance((plan) => ({
          ...plan,
          currentFundsManwon: Math.max(0, plan.currentFundsManwon - target.amountManwon),
        }));
      }
      return prev.filter((record) => record.id !== id);
    });
  }, []);

  const addDiary = useCallback((entry: Omit<DiaryEntry, 'id'>) => {
    setDiary((prev) => [{ ...entry, id: makeId('diary') }, ...prev]);
  }, []);

  const removeDiary = useCallback((id: string) => {
    setDiary((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const toggleContract = useCallback((id: string) => {
    setContractChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const resetContract = useCallback(() => setContractChecks({}), []);

  const toggleVisit = useCallback((id: string) => {
    setVisitChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setVisitMemo = useCallback((id: string, memo: string) => {
    setVisitMemos((prev) => ({ ...prev, [id]: memo }));
  }, []);

  const toggleSavedComplex = useCallback((id: string) => {
    setProfile((prev) => {
      const has = prev.savedComplexIds.includes(id);
      return {
        ...prev,
        savedComplexIds: has
          ? prev.savedComplexIds.filter((saved) => saved !== id)
          : [...prev.savedComplexIds, id],
      };
    });
  }, []);

  const candidates = useMemo(() => findCandidates(profile, SAMPLE_COMPLEXES), [profile]);

  const savedComplexes = useMemo(() => {
    const fromSaved = profile.savedComplexIds
      .map((id) => SAMPLE_COMPLEXES.find((complex) => complex.id === id))
      .filter((complex): complex is Complex => Boolean(complex));
    if (fromSaved.length > 0) return fromSaved;
    // 아직 관심 단지를 고르지 않았다면 후보 1곳을 기본으로 보여 줍니다(저장하지 않음).
    return candidates.length > 0 ? [candidates[0].complex] : [];
  }, [profile.savedComplexIds, candidates]);

  const summary = useMemo(() => summarizeFinance(finance), [finance]);
  const completion = useMemo(() => profileCompletion(profile), [profile]);

  const value = useMemo<StoreValue>(
    () => ({
      profile,
      updateProfile,
      resetProfile,
      markProfileSaved,
      finance,
      updateFinance,
      summary,
      savings,
      addSaving,
      removeSaving,
      diary,
      addDiary,
      removeDiary,
      contractChecks,
      toggleContract,
      resetContract,
      visitChecks,
      toggleVisit,
      visitMemos,
      setVisitMemo,
      candidates,
      savedComplexes,
      toggleSavedComplex,
      completion,
      notice,
      notify,
    }),
    [
      profile,
      updateProfile,
      resetProfile,
      markProfileSaved,
      finance,
      updateFinance,
      summary,
      savings,
      addSaving,
      removeSaving,
      diary,
      addDiary,
      removeDiary,
      contractChecks,
      toggleContract,
      resetContract,
      visitChecks,
      toggleVisit,
      visitMemos,
      setVisitMemo,
      candidates,
      savedComplexes,
      toggleSavedComplex,
      completion,
      notice,
      notify,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
