import { openDB } from 'idb';
import { ShiftRecord } from '../types';

const DB_NAME = 'cash_drawer_db';
const STORE_NAME = 'shifts';
const DB_VERSION = 1;

export class DatabaseManager {
  private dbPromise;

  constructor() {
    this.dbPromise = this.initDatabase();
  }

  private async initDatabase() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('openTime', 'openTime', { unique: false });
        }
      }
    });
  }

  async saveShift(shift: ShiftRecord): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, shift);
  }

  async getAllShifts(): Promise<ShiftRecord[]> {
    const db = await this.dbPromise;
    const shifts = await db.getAll(STORE_NAME);
    return shifts.sort((a, b) => 
      new Date(b.openTime).getTime() - new Date(a.openTime).getTime()
    );
  }

  async getOpenShift(): Promise<ShiftRecord | null> {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.store.index('status');
    const openShifts = await index.getAll('open');
    return openShifts[0] || null;
  }

  async clearHistory(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;
    
    // Get all shifts
    const shifts = await store.getAll();
    
    // Only delete closed shifts
    const promises = shifts
      .filter(shift => shift.status === 'closed')
      .map(shift => store.delete(shift.id));
    
    await Promise.all(promises);
    await tx.done;
  }
}