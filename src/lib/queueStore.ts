// Simple in-memory queue store with localStorage persistence
// Supports two service types: A (Pendaftaran) and B (Informasi)

export type ServiceType = 'A' | 'B';
export type QueueMode = 'NORMAL' | 'SIMPLIFIED';

export interface QueueTicket {
  id: string;
  number: number;
  serviceType: ServiceType;
  formattedNumber: string;
  createdAt: Date;
  status: 'waiting' | 'called' | 'served' | 'skipped';
  loket?: number;
  calledAt?: Date;
}

export interface CalledByLoket {
  [key: number]: QueueTicket | null;
}

export interface QueueState {
  tickets: QueueTicket[];
  currentNumberA: number; // Counter for A tickets
  currentNumberB: number; // Counter for B tickets
  lastReset: string;
  calledByLoket: CalledByLoket;
  config: {
    mode: QueueMode;
    runningText: string;
  };
}

const STORAGE_KEY = 'queue_state';

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const formatQueueNumber = (num: number, serviceType: ServiceType): string => {
  return `${serviceType}${String(num).padStart(3, '0')}`;
};

const parseTicket = (t: any): QueueTicket => ({
  ...t,
  createdAt: new Date(t.createdAt),
  calledAt: t.calledAt ? new Date(t.calledAt) : undefined,
});

const parseCalledByLoket = (data: any): CalledByLoket => {
  const result: CalledByLoket = {};
  if (data) {
    Object.keys(data).forEach(key => {
      const numKey = parseInt(key);
      result[numKey] = data[key] ? parseTicket(data[key]) : null;
    });
  }
  return result;
};

const getEmptyCalledByLoket = (): CalledByLoket => {
  const result: CalledByLoket = {};
  for (let i = 1; i <= 10; i++) {
    result[i] = null;
  }
  return result;
};

export const getInitialState = (): QueueState => {
  const today = getTodayString();
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Reset if it's a new day
      if (parsed.lastReset !== today) {
        return {
          tickets: [],
          currentNumberA: 0,
          currentNumberB: 0,
          lastReset: today,
          calledByLoket: getEmptyCalledByLoket(),
          config: parsed.config || { mode: 'NORMAL', runningText: '✯✧☆ SELAMAT DATANG DI RUMAH TAHANAN NEGARA KELAS I DEPOK ✯✧☆ KAMI BERKOMITMEN MEMBERIKAN PELAYANAN YANG CEPAT, TRANSPARAN, DAN PROFESIONAL ✯✧☆ MOHON ANTRI DENGAN TERTIB DEMI KENYAMANAN BERSAMA ✯✧☆ HUBUNGI PETUGAS JIKA MEMBUTUHKAN BANTUAN ✯✧☆' },
        };
      }

      // Handle migration from old format
      if (parsed.currentNumber !== undefined && parsed.currentNumberA === undefined) {
        return {
          tickets: parsed.tickets.map((t: any) => ({
            ...parseTicket(t),
            serviceType: 'A',
            formattedNumber: `A${String(t.number).padStart(3, '0')}`,
          })),
          currentNumberA: parsed.currentNumber,
          currentNumberB: 0,
          lastReset: parsed.lastReset,
          calledByLoket: parseCalledByLoket(parsed.calledByLoket),
          config: parsed.config || { mode: 'NORMAL', runningText: '✯✧☆ SELAMAT DATANG DI RUMAH TAHANAN NEGARA KELAS I DEPOK ✯✧☆ KAMI BERKOMITMEN MEMBERIKAN PELAYANAN YANG CEPAT, TRANSPARAN, DAN PROFESIONAL ✯✧☆ MOHON ANTRI DENGAN TERTIB DEMI KENYAMANAN BERSAMA ✯✧☆ HUBUNGI PETUGAS JIKA MEMBUTUHKAN BANTUAN ✯✧☆' },
        };
      }

      return {
        ...parsed,
        tokens: parsed.tickets.map(parseTicket),
        calledByLoket: parseCalledByLoket(parsed.calledByLoket),
        config: {
          mode: parsed.config?.mode || 'NORMAL',
          runningText: parsed.config?.runningText || '✯✧☆ SELAMAT DATANG DI RUMAH TAHANAN NEGARA KELAS I DEPOK ✯✧☆ KAMI BERKOMITMEN MEMBERIKAN PELAYANAN YANG CEPAT, TRANSPARAN, DAN PROFESIONAL ✯✧☆ MOHON ANTRI DENGAN TERTIB DEMI KENYAMANAN BERSAMA ✯✧☆ HUBUNGI PETUGAS JIKA MEMBUTUHKAN BANTUAN ✯✧☆'
        },
      };
    } catch {
      // Invalid stored data
    }
  }

  return {
    tickets: [],
    currentNumberA: 0,
    currentNumberB: 0,
    lastReset: today,
    calledByLoket: getEmptyCalledByLoket(),
    config: {
      mode: 'NORMAL',
      runningText: '✯✧☆ SELAMAT DATANG DI RUMAH TAHANAN NEGARA KELAS I DEPOK ✯✧☆ KAMI BERKOMITMEN MEMBERIKAN PELAYANAN YANG CEPAT, TRANSPARAN, DAN PROFESIONAL ✯✧☆ MOHON ANTRI DENGAN TERTIB DEMI KENYAMANAN BERSAMA ✯✧☆ HUBUNGI PETUGAS JIKA MEMBUTUHKAN BANTUAN ✯✧☆'
    },
  };
};

export const saveState = (state: QueueState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Broadcast to other tabs
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(state),
  }));
};

export const takeNumber = (serviceType: ServiceType): QueueTicket => {
  const state = getInitialState();

  let newNumber: number;
  if (serviceType === 'A') {
    newNumber = state.currentNumberA + 1;
    state.currentNumberA = newNumber;
  } else {
    newNumber = state.currentNumberB + 1;
    state.currentNumberB = newNumber;
  }

  const ticket: QueueTicket = {
    id: `${getTodayString()}-${serviceType}-${newNumber}`,
    number: newNumber,
    serviceType,
    formattedNumber: formatQueueNumber(newNumber, serviceType),
    createdAt: new Date(),
    status: 'waiting',
  };

  state.tickets.push(ticket);
  saveState(state);

  return ticket;
};

// Get allowed service types for a loket
const getAllowedServiceType = (loket: number): ServiceType | null => {
  if (loket < 1 || loket > 10) return null;

  const state = getInitialState();
  if (loket === 4 && state.config.mode === 'NORMAL') {
    return 'B';
  }

  // All other lokets (1-3, 5-10) or loket 4 (in SIMPLIFIED) are Service A
  return 'A';
};

export const callNext = (loket: number, forcedType?: ServiceType): QueueTicket | null => {
  const state = getInitialState();
  const allowedType = forcedType || getAllowedServiceType(loket);

  if (!allowedType) return null;

  // Filter waiting tickets by service type
  const waiting = state.tickets.filter(t =>
    t.status === 'waiting' && t.serviceType === allowedType
  );

  if (waiting.length === 0) return null;

  const next = waiting[0];
  next.status = 'called';
  next.loket = loket;
  next.calledAt = new Date();

  state.calledByLoket[loket] = next;

  saveState(state);
  return next;
};

export const recallCurrent = (loket: number): QueueTicket | null => {
  const state = getInitialState();
  if (loket < 1 || loket > 10) return null;

  const current = state.calledByLoket[loket];
  if (!current) return null;

  current.calledAt = new Date();
  state.calledByLoket[loket] = current;
  saveState(state);

  return current;
};

export const skipCurrent = (loket: number): boolean => {
  const state = getInitialState();
  if (loket < 1 || loket > 10) return false;

  const current = state.calledByLoket[loket];
  if (!current) return false;

  const ticket = state.tickets.find(t => t.id === current.id);
  if (ticket) {
    ticket.status = 'skipped';
  }

  state.calledByLoket[loket] = null;
  saveState(state);

  return true;
};

export const markServed = (loket: number): boolean => {
  const state = getInitialState();
  if (loket < 1 || loket > 10) return false;

  const current = state.calledByLoket[loket];
  if (!current) return false;

  const ticket = state.tickets.find(t => t.id === current.id);
  if (ticket) {
    ticket.status = 'served';
  }

  state.calledByLoket[loket] = null;
  saveState(state);

  return true;
};

export const getWaitingCount = (serviceType?: ServiceType): number => {
  const state = getInitialState();
  if (serviceType) {
    return state.tickets.filter(t => t.status === 'waiting' && t.serviceType === serviceType).length;
  }
  return state.tickets.filter(t => t.status === 'waiting').length;
};

export const getWaitingTickets = (serviceType: ServiceType): QueueTicket[] => {
  const state = getInitialState();
  return state.tickets.filter(t => t.status === 'waiting' && t.serviceType === serviceType);
};

export const getCalledByLoket = (loket: number): QueueTicket | null => {
  const state = getInitialState();
  if (loket < 1 || loket > 10) return null;
  return state.calledByLoket[loket];
};

export const setQueueMode = (mode: QueueMode): void => {
  const state = getInitialState();
  state.config.mode = mode;
  saveState(state);
};

export const setRunningText = (text: string): void => {
  const state = getInitialState();
  state.config.runningText = text;
  saveState(state);
};

export const resetQueue = (): void => {
  const today = getTodayString();
  const state = getInitialState();
  const newState: QueueState = {
    tickets: [],
    currentNumberA: 0,
    currentNumberB: 0,
    lastReset: today,
    calledByLoket: getEmptyCalledByLoket(),
    config: state.config,
  };
  saveState(newState);
};

export const isLastWaiting = (serviceType: ServiceType): boolean => {
  const state = getInitialState();
  return state.tickets.filter(t => t.status === 'waiting' && t.serviceType === serviceType).length === 0;
};

export const subscribeToChanges = (callback: (state: QueueState) => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback({
          ...parsed,
          tickets: parsed.tickets.map(parseTicket),
          calledByLoket: parseCalledByLoket(parsed.calledByLoket),
        });
      } catch {
        // Invalid data
      }
    }
  };

  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};
