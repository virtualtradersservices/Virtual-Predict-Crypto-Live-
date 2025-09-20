
import React from 'react';
import type { Recommendation } from '../types';

interface RecommendationPanelProps {
  data: Recommendation;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ data }) => {
  const { action, size_pct, stop_loss_pct, rationale } = data;
  const actionColor = action === 'buy' ? 'text-brand-success' : action === 'sell' ? 'text-brand-danger' : 'text-yellow-400';
  const bgColor = action === 'buy' ? 'bg-brand-success/10' : action === 'sell' ? 'bg-brand-danger/10' : 'bg-yellow-400/10';

  const ActionIcon = () => {
    if (action === 'buy') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
    }
    if (action === 'sell') {
      return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  return (
    <section aria-labelledby="recommendation-heading" className="bg-brand-surface border border-brand-border rounded-lg p-4 space-y-3">
      <h3 id="recommendation-heading" className="font-bold text-lg text-white">Recommendation</h3>
      <div className={`p-4 rounded-lg flex items-center justify-between ${bgColor}`}>
        <span className={`text-2xl font-bold uppercase ${actionColor}`}>{action}</span>
        <div className={actionColor}><ActionIcon /></div>
      </div>
      <p className="text-sm text-brand-muted italic">"{rationale}"</p>
      <div className="border-t border-brand-border pt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-muted">Suggested Size:</span>
          <span className="font-mono text-white">{size_pct.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brand-muted">Stop Loss:</span>
          <span className="font-mono text-white">{stop_loss_pct.toFixed(1)}%</span>
        </div>
      </div>
    </section>
  );
};

export default RecommendationPanel;
