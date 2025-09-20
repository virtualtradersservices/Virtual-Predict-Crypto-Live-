
import React from 'react';
import type { Backtest, Scenarios } from '../types';

interface InfoPanelProps {
  backtest: Backtest;
  scenarios: Scenarios;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ backtest, scenarios }) => {
  return (
    <section aria-labelledby="analysis-heading" className="bg-brand-surface border border-brand-border rounded-lg p-4 space-y-4">
      <h3 id="analysis-heading" className="font-bold text-lg text-white">Analysis & Reports</h3>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-brand-secondary">Backtest Summary</h4>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Sharpe Ratio:</span>
          <span className="font-mono text-white">{backtest.sharpe.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Max Drawdown:</span>
          <span className="font-mono text-brand-danger">{backtest.max_dd.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 pt-2 border-t border-brand-border">
        <a href={scenarios.diffusion_url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-brand-primary/10 text-brand-primary text-sm font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/20 transition-colors">
          Explore {scenarios.n_paths} Scenarios
        </a>
        <button className="w-full text-center bg-brand-border/50 text-brand-secondary text-sm font-semibold py-2 px-4 rounded-md hover:bg-brand-border transition-colors">
          Download Backtest Report
        </button>
      </div>
    </section>
  );
};

export default InfoPanel;
