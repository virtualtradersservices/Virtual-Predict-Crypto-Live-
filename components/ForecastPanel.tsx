
import React from 'react';
import type { ApiResponse } from '../types';

interface ForecastPanelProps {
  data: ApiResponse;
}

const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ForecastPanel: React.FC<ForecastPanelProps> = ({ data }) => {
  const { forecast, confidence, model_id, horizon } = data;
  return (
    <section aria-labelledby="forecast-heading" className="bg-brand-surface border border-brand-border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 id="forecast-heading" className="font-bold text-lg text-white">Forecast ({horizon})</h3>
        <p className="text-xs font-mono bg-brand-bg px-2 py-1 rounded truncate" title={model_id}>{model_id.split('-').slice(0,2).join('-')}</p>
      </div>

      <div className="text-center py-2">
        <p className="text-brand-muted text-sm" id="point-forecast-label">Point Forecast</p>
        <p className="text-3xl font-bold text-brand-primary" aria-labelledby="point-forecast-label">{formatNumber(forecast.point)}</p>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
            <span className="text-brand-muted">Confidence</span>
            <span className="font-mono text-white">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
            <span className="text-brand-muted">q90 / q10</span>
            <span className="font-mono text-white">{formatNumber(forecast.q90)} / {formatNumber(forecast.q10)}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-brand-muted">q75 / q25</span>
            <span className="font-mono text-white">{formatNumber(forecast.q75)} / {formatNumber(forecast.q25)}</span>
        </div>
      </div>
    </section>
  );
};

export default ForecastPanel;
