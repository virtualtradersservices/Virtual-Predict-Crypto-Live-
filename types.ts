
export type Horizon = '1h' | '4h' | '1d' | '1w' | '1m';

export interface Forecast {
  point: number;
  q10: number;
  q25: number;
  q50: number;
  q75: number;
  q90: number;
}

export interface TopFeature {
  name: string;
  value: number;
  shap: number;
}

export interface Recommendation {
  action: 'buy' | 'sell' | 'hold';
  size_pct: number;
  stop_loss_pct: number;
  rationale: string;
}

export interface Backtest {
  period: string;
  sharpe: number;
  max_dd: number;
}

export interface Scenarios {
  diffusion_url: string;
  n_paths: number;
}

export interface Provenance {
  data_sources: string[];
  feature_store_snapshot: string;
  model_commit: string;
}

export interface ApiResponse {
  symbol: string;
  horizon: Horizon;
  timestamp: string;
  forecast: Forecast;
  confidence: number;
  model_id: string;
  top_features: TopFeature[];
  recommendation: Recommendation;
  backtest: Backtest;
  scenarios: Scenarios;
  explain_url: string;
  provenance: Provenance;
  log_id: string;
}

export interface PricePoint {
  timestamp: number;
  date: string;
  // Historical data
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  // Forecast data
  point?: number;
  q10?: number;
  q25?: number;
  q50?: number;
  q75?: number;
  q90?: number;
}

export interface CryptoCurrency {
    id: string;
    name: string;
}

export type AlertConditionType = 'price' | 'confidence' | 'recommendation';

export type PriceAlertCondition = {
    type: 'price';
    direction: 'above' | 'below';
    value: number;
};

export type ConfidenceAlertCondition = {
    type: 'confidence';
    direction: 'above' | 'below';
    value: number; // 0 to 1
};

export type RecommendationAlertCondition = {
    type: 'recommendation';
    alertOnAnyChange: boolean;
};

export type AlertSetting = {
    id: string;
    condition: PriceAlertCondition | ConfidenceAlertCondition | RecommendationAlertCondition;
    createdAt: number;
    symbol: string; // To scope alerts to a specific symbol
};

export interface TriggeredAlert {
    id: string;
    message: string;
    timestamp: number;
    settingId: string;
}
