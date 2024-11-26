import React, { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Download, Trash2 } from 'lucide-react';
import { ShiftRecord } from '../types';
import { generatePDF, generateHistoryPDF } from '../utils/pdfGenerator';
import { DatabaseManager } from '../utils/database';

interface ShiftHistoryProps {
  history: ShiftRecord[];
  onHistoryCleared: () => void;
}

export function ShiftHistory({ history, onHistoryCleared }: ShiftHistoryProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all closed shift history? This action cannot be undone.')) {
      try {
        setIsClearing(true);
        const db = new DatabaseManager();
        await db.clearHistory();
        onHistoryCleared();
      } catch (error) {
        console.error('Error clearing history:', error);
        alert('Failed to clear history. Please try again.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shift History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => generateHistoryPDF(history)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Export All
          </button>
          <button
            onClick={handleClearHistory}
            disabled={isClearing || history.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
            Clear History
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No shift history available
          </div>
        ) : (
          history.map((shift) => (
            <div key={shift.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    {shift.organizationName || 'Unnamed Organization'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Opened: {format(new Date(shift.openTime), 'PPpp')}
                  </p>
                  {shift.closeTime && (
                    <p className="text-sm text-gray-600">
                      Closed: {format(new Date(shift.closeTime), 'PPpp')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => generatePDF(shift)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <FileText size={16} />
                  Export PDF
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Opening Balance</p>
                  <p className="text-lg font-semibold">${shift.openingBalance.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Closing Balance</p>
                  <p className="text-lg font-semibold">
                    ${shift.closingBalance?.toFixed(2) || '---'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}