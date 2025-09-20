
import React, { useState } from 'react';
import type { AlertSetting, AlertConditionType } from '../types';

interface AlertsManagerProps {
  symbol: string;
  alertSettings: AlertSetting[];
  onSettingsChange: (settings: AlertSetting[]) => void;
}

const AlertsManager: React.FC<AlertsManagerProps> = ({ symbol, alertSettings, onSettingsChange }) => {
  const [alertType, setAlertType] = useState<AlertConditionType>('price');
  const [priceDirection, setPriceDirection] = useState<'above' | 'below'>('above');
  const [priceValue, setPriceValue] = useState('');
  const [confidenceDirection, setConfidenceDirection] = useState<'above' | 'below'>('above');
  const [confidenceValue, setConfidenceValue] = useState('');
  const [recChange, setRecChange] = useState(true);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    let newSetting: AlertSetting | null = null;
    const common = { id: `alert-${Date.now()}`, createdAt: Date.now(), symbol };

    if (alertType === 'price' && priceValue) {
      newSetting = { ...common, condition: { type: 'price', direction: priceDirection, value: parseFloat(priceValue) } };
      setPriceValue('');
    } else if (alertType === 'confidence' && confidenceValue) {
        const confVal = parseFloat(confidenceValue);
        if (confVal >= 0 && confVal <= 100) {
            newSetting = { ...common, condition: { type: 'confidence', direction: confidenceDirection, value: confVal / 100 } };
            setConfidenceValue('');
        } else {
            // simple validation feedback could be added here
            return;
        }
    } else if (alertType === 'recommendation') {
      newSetting = { ...common, condition: { type: 'recommendation', alertOnAnyChange: recChange } };
    }

    if (newSetting) {
      onSettingsChange([...alertSettings, newSetting]);
    }
  };

  const handleRemoveAlert = (id: string) => {
    onSettingsChange(alertSettings.filter(s => s.id !== id));
  };
    
  const getConditionText = (setting: AlertSetting): string => {
      if (setting.symbol !== symbol) return ''; // Should not happen with current filter
      const { condition } = setting;
      switch (condition.type) {
          case 'price':
              return `Price ${condition.direction} ${condition.value.toLocaleString()}`;
          case 'confidence':
              return `Confidence ${condition.direction} ${(condition.value * 100).toFixed(0)}%`;
          case 'recommendation':
              return `On recommendation change`;
      }
      return '';
  }

  const symbolAlerts = alertSettings.filter(s => s.symbol === symbol);

  return (
    <section aria-labelledby="alerts-manager-heading" className="bg-brand-surface border border-brand-border rounded-lg p-4 md:p-6 space-y-6 h-full">
      <h3 id="alerts-manager-heading" className="font-bold text-lg text-white">Manage Alerts for {symbol}</h3>
      
      <form onSubmit={handleAddAlert} className="space-y-4">
        <div>
            <label htmlFor="alert-type" className="block text-sm font-medium text-brand-muted mb-2">Alert Type</label>
            <select
                id="alert-type"
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertConditionType)}
                className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 w-full text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
                <option value="price">Price Target</option>
                <option value="confidence">Confidence Threshold</option>
                <option value="recommendation">Recommendation Change</option>
            </select>
        </div>

        {alertType === 'price' && (
            <div className="flex gap-2">
                <select value={priceDirection} onChange={(e) => setPriceDirection(e.target.value as 'above' | 'below')} className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                </select>
                <input type="number" placeholder="Enter price" value={priceValue} onChange={e => setPriceValue(e.target.value)} required className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 w-full text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
            </div>
        )}

        {alertType === 'confidence' && (
             <div className="flex gap-2 items-center">
                <select value={confidenceDirection} onChange={(e) => setConfidenceDirection(e.target.value as 'above' | 'below')} className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                </select>
                <input type="number" placeholder="e.g., 80" value={confidenceValue} onChange={e => setConfidenceValue(e.target.value)} required min="0" max="100" className="bg-brand-bg border border-brand-border rounded-md px-3 py-2 w-full text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                <span className="text-brand-muted">%</span>
            </div>
        )}

        <div>
            <button type="submit" className="w-full bg-brand-primary/10 text-brand-primary border border-brand-primary/50 font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/20 transition-colors">
                Add Alert
            </button>
        </div>
      </form>
      
      {symbolAlerts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-brand-border">
            <h4 className="font-semibold text-brand-secondary">Active Alerts</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
                {symbolAlerts.map(setting => (
                    <li key={setting.id} className="bg-brand-bg p-2 rounded-md flex justify-between items-center text-sm">
                       <span className="truncate pr-2">{getConditionText(setting)}</span>
                       <button onClick={() => handleRemoveAlert(setting.id)} className="p-1 text-brand-muted hover:text-brand-danger transition-colors flex-shrink-0" aria-label={`Remove alert: ${getConditionText(setting)}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </section>
  );
};

export default AlertsManager;
