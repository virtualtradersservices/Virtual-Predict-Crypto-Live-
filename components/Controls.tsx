import React from 'react';
import { CRYPTOCURRENCIES, HORIZONS } from '../constants';
import type { Horizon } from '../types';

interface ControlsProps {
  symbol: string;
  setSymbol: (symbol: string) => void;
  horizon: Horizon;
  setHorizon: (horizon: Horizon) => void;
  onDataRequest: (symbol: string, horizon: Horizon) => void;
  loading: boolean;
  livePrice: number | null;
}

const Controls: React.FC<ControlsProps> = ({
  symbol,
  setSymbol,
  horizon,
  setHorizon,
  onDataRequest,
  loading,
  livePrice,
}) => {
    
  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSymbol = e.target.value;
    setSymbol(newSymbol);
    onDataRequest(newSymbol, horizon);
  };

  const handleHorizonChange = (h: Horizon) => {
    setHorizon(h);
    onDataRequest(symbol, h);
  }
  
  const handleRefresh = () => {
    onDataRequest(symbol, horizon);
  }

  const formatLivePrice = (price: number | null) => {
    if (price === null) return 'N/A';
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price > 1 ? 2 : 6,
    });
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="w-full md:w-auto">
            <label htmlFor="crypto-select" className="sr-only">Select Cryptocurrency</label>
            <select
              id="crypto-select"
              value={symbol}
              onChange={handleSymbolChange}
              disabled={loading}
              className="bg-brand-bg border border-brand-border rounded-md px-4 py-2 w-full md:w-48 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition-colors disabled:opacity-50"
              aria-label="Select cryptocurrency"
            >
              {CRYPTOCURRENCIES.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>{crypto.name} ({crypto.id})</option>
              ))}
            </select>
        </div>
        <div role="group" aria-label="Select forecast horizon" className="flex items-center space-x-1 sm:space-x-2 bg-brand-bg border border-brand-border rounded-lg p-1">
          {HORIZONS.map((h) => (
            <button
              key={h.value}
              onClick={() => handleHorizonChange(h.value)}
              disabled={loading}
              className={`px-2 sm:px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                horizon === h.value
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-muted hover:bg-brand-border/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-pressed={horizon === h.value}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <div className="hidden sm:flex items-center gap-2 text-sm text-brand-muted" aria-live="polite">
            <span className="font-semibold text-brand-secondary">Live Price:</span>
            {!loading && livePrice !== null ? (
                <span className="font-mono text-white">{formatLivePrice(livePrice)}</span>
            ) : (
                <span className="font-mono text-brand-muted animate-pulse">Loading...</span>
            )}
        </div>
         <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/50 px-4 py-2 rounded-md font-semibold hover:bg-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh forecast data"
          >
            {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
                </svg>
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
         </button>
      </div>
    </div>
  );
};

export default Controls;