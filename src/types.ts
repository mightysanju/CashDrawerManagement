export interface CashEntry {
  type: 'bill' | 'coin' | 'roll' | 'receipt';
  denomination: number;
  quantity: number;
  total: number;
}

export interface ShiftRecord {
  id: string;
  organizationName?: string;
  drawerNumber: string;
  cashierName: string;
  openTime: string;
  closeTime?: string;
  openingBalance: number;
  closingBalance?: number;
  shiftDrop?: number;
  entries: CashEntry[];
  status: 'open' | 'closed';
}

export interface DrawerState {
  currentShift: ShiftRecord | null;
  shiftHistory: ShiftRecord[];
  organizationName: string;
  drawerNumber: string;
  cashierName: string;
}