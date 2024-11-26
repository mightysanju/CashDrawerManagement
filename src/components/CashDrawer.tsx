import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Banknote, 
  Coins, 
  Receipt, 
  Clock,
  Building2,
  History,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { CashEntry, ShiftRecord } from '../types';
import { ShiftHistory } from './ShiftHistory';
import { DatabaseManager } from '../utils/database';
import { AdUnit } from './AdUnit';

const DENOMINATIONS = {
  bill: [100, 50, 20, 10, 5, 1],
  coin: [1, 0.25, 0.10, 0.05, 0.01],
  roll: [10, 5, 2, 1, 0.5],
};

const db = new DatabaseManager();

export function CashDrawer() {
  const [organizationName, setOrganizationName] = useState('');
  const [drawerNumber, setDrawerNumber] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [currentShift, setCurrentShift] = useState<ShiftRecord | null>(null);
  const [shiftHistory, setShiftHistory] = useState<ShiftRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [shiftDrop, setShiftDrop] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newReceiptAmount, setNewReceiptAmount] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [openShift, history] = await Promise.all([
        db.getOpenShift(),
        db.getAllShifts()
      ]);

      if (openShift) {
        setCurrentShift(openShift);
        setEntries(openShift.entries);
        setOrganizationName(openShift.organizationName || '');
        setDrawerNumber(openShift.drawerNumber);
        setCashierName(openShift.cashierName);
      }
      setShiftHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startShift = async () => {
    if (!drawerNumber || !cashierName) {
      alert('Please enter both drawer number and cashier name');
      return;
    }

    try {
      setIsLoading(true);
      const newShift: ShiftRecord = {
        id: Date.now().toString(),
        organizationName,
        drawerNumber,
        cashierName,
        openTime: new Date().toISOString(),
        openingBalance: calculateTotal(),
        entries: [...entries],
        status: 'open'
      };

      await db.saveShift(newShift);
      setCurrentShift(newShift);
      await loadData();
    } catch (error) {
      console.error('Error starting shift:', error);
      alert('Failed to start shift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const endShift = async () => {
    if (!currentShift) return;

    try {
      setIsLoading(true);
      const closedShift: ShiftRecord = {
        ...currentShift,
        closeTime: new Date().toISOString(),
        closingBalance: calculateTotal(),
        shiftDrop,
        entries: [...entries],
        status: 'closed'
      };

      await db.saveShift(closedShift);
      setCurrentShift(null);
      setEntries([]);
      setShiftDrop(0);
      await loadData();
    } catch (error) {
      console.error('Error ending shift:', error);
      alert('Failed to end shift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => 
    entries.reduce((sum, entry) => sum + entry.total, 0);

  const updateEntry = (type: CashEntry['type'], denomination: number, quantity: number) => {
    const total = denomination * quantity;
    const existingIndex = entries.findIndex(
      e => e.type === type && e.denomination === denomination
    );

    const newEntries = [...entries];
    if (existingIndex >= 0) {
      if (quantity === 0) {
        newEntries.splice(existingIndex, 1);
      } else {
        newEntries[existingIndex] = { type, denomination, quantity, total };
      }
    } else if (quantity > 0) {
      newEntries.push({ type, denomination, quantity, total });
    }
    setEntries(newEntries);
  };

  const addReceipt = () => {
    const amount = parseFloat(newReceiptAmount);
    if (!isNaN(amount) && amount > 0) {
      updateEntry('receipt', amount, 1);
      setNewReceiptAmount('');
    }
  };

  const removeReceipt = (denomination: number) => {
    setEntries(entries.filter(entry => 
      !(entry.type === 'receipt' && entry.denomination === denomination)
    ));
  };

  const getReceiptEntries = () => 
    entries.filter(entry => entry.type === 'receipt');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
          <p className="mt-2 text-gray-500">Please wait while we initialize the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Ad Unit */}
        <div className="mb-8">
          <AdUnit slot="top-banner" className="mx-auto max-w-[728px]" />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Cash Drawer Manager</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <History size={20} />
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Building2 size={24} className="text-gray-600" />
              <input
                type="text"
                placeholder="Organization Name (Optional)"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Drawer Number *"
                value={drawerNumber}
                onChange={(e) => setDrawerNumber(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cashier Name *"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          {currentShift ? (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-green-600" />
                <span className="text-green-700">
                  Shift Started: {format(new Date(currentShift.openTime), 'PPpp')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Shift Drop Amount"
                  value={shiftDrop || ''}
                  onChange={(e) => setShiftDrop(parseFloat(e.target.value) || 0)}
                  className="p-2 border rounded-lg w-40"
                />
                <button
                  onClick={endShift}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  End Shift
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={startShift}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-6"
            >
              Start New Shift
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bills Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Banknote size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">Bills</h2>
              </div>
              {DENOMINATIONS.bill.map(denom => (
                <div key={`bill-${denom}`} className="flex items-center gap-2 mb-2">
                  <span className="w-12">${denom}</span>
                  <input
                    type="number"
                    min="0"
                    value={entries.find(e => e.type === 'bill' && e.denomination === denom)?.quantity || ''}
                    onChange={(e) => updateEntry('bill', denom, parseInt(e.target.value) || 0)}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              ))}
            </div>

            {/* Coins Section */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Coins size={24} className="text-yellow-600" />
                <h2 className="text-xl font-semibold text-yellow-800">Coins</h2>
              </div>
              {DENOMINATIONS.coin.map(denom => (
                <div key={`coin-${denom}`} className="flex items-center gap-2 mb-2">
                  <span className="w-12">${denom.toFixed(2)}</span>
                  <input
                    type="number"
                    min="0"
                    value={entries.find(e => e.type === 'coin' && e.denomination === denom)?.quantity || ''}
                    onChange={(e) => updateEntry('coin', denom, parseInt(e.target.value) || 0)}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              ))}
            </div>

            {/* Rolls Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={24} className="text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-800">Rolls</h2>
              </div>
              {DENOMINATIONS.roll.map(denom => (
                <div key={`roll-${denom}`} className="flex items-center gap-2 mb-2">
                  <span className="w-12">${denom.toFixed(2)}</span>
                  <input
                    type="number"
                    min="0"
                    value={entries.find(e => e.type === 'roll' && e.denomination === denom)?.quantity || ''}
                    onChange={(e) => updateEntry('roll', denom, parseInt(e.target.value) || 0)}
                    className="w-20 p-1 border rounded"
                  />
                </div>
              ))}
            </div>

            {/* Receipts Section */}
            <div className="bg-green-50 p-4 rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Receipt size={24} className="text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Receipts</h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Amount"
                  value={newReceiptAmount}
                  onChange={(e) => setNewReceiptAmount(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={addReceipt}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2">
                {getReceiptEntries().map((entry, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                    <span>${entry.denomination.toFixed(2)}</span>
                    <button
                      onClick={() => removeReceipt(entry.denomination)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* In-content Ad Unit */}
        <div className="my-8">
          <AdUnit slot="in-article" className="mx-auto max-w-[728px]" />
        </div>

        {showHistory && (
          <ShiftHistory 
            history={shiftHistory} 
            onHistoryCleared={loadData}
          />
        )}

        {/* Bottom Ad Unit */}
        <div className="mt-8">
          <AdUnit slot="bottom-banner" className="mx-auto max-w-[728px]" />
        </div>
      </div>
    </div>
  );
}