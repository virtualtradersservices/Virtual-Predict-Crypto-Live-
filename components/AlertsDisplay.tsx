
import React from 'react';
import type { TriggeredAlert } from '../types';

interface AlertsDisplayProps {
  alerts: TriggeredAlert[];
  onDismiss: (id: string) => void;
}

const AlertsDisplay: React.FC<AlertsDisplayProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6" role="region" aria-label="Triggered Alerts">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-yellow-400/10 border border-yellow-400/50 text-yellow-300 p-4 rounded-lg flex items-center justify-between shadow-lg"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-xs text-yellow-300/70">{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 rounded-full hover:bg-yellow-400/20 transition-colors"
            aria-label={`Dismiss alert: ${alert.message}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertsDisplay;
