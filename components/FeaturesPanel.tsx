
import React from 'react';
import type { TopFeature } from '../types';

interface FeaturesPanelProps {
  features: TopFeature[];
}

const FeatureBar: React.FC<{ feature: TopFeature; maxShap: number }> = ({ feature, maxShap }) => {
  const widthPercentage = maxShap > 0 ? (Math.abs(feature.shap) / maxShap) * 100 : 0;
  const isPositive = feature.shap >= 0;

  return (
    <div className="flex items-center gap-4 text-sm" role="listitem">
      <div className="w-1/3 truncate text-brand-muted" title={feature.name}>
        {feature.name.replace(/_/g, ' ')}
      </div>
      <div className="w-2/3 flex items-center gap-2">
        <div className="w-full bg-brand-border/30 rounded-full h-4" aria-label={`SHAP contribution bar for ${feature.name}`}>
          <div
            className={`h-4 rounded-full ${isPositive ? 'bg-brand-success' : 'bg-brand-danger'}`}
            style={{ width: `${widthPercentage}%` }}
            title={`SHAP value: ${feature.shap}`}
            role="presentation"
          ></div>
        </div>
        <div className={`w-12 text-right font-mono text-xs ${isPositive ? 'text-brand-success' : 'text-brand-danger'}`}>
          {feature.shap.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const FeaturesPanel: React.FC<FeaturesPanelProps> = ({ features }) => {
  const maxShap = Math.max(...features.map(f => Math.abs(f.shap)), 0);

  return (
    <div className="space-y-4">
      <h3 id="features-heading" className="font-bold text-lg text-white">Top 5 Feature Attributions (SHAP)</h3>
      <div className="space-y-3" role="list" aria-labelledby="features-heading">
        {features.slice(0, 5).map(feature => (
          <FeatureBar key={feature.name} feature={feature} maxShap={maxShap} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesPanel;
