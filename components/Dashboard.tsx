import React from 'react';
import Controls from './Controls';
import PriceChart from './PriceChart';
import ForecastPanel from './ForecastPanel';
import FeaturesPanel from './FeaturesPanel';
import RecommendationPanel from './RecommendationPanel';
import InfoPanel from './InfoPanel';
import AlertsManager from './AlertsManager';
import { SkeletonLoader } from './SkeletonLoader';
import type { ApiResponse, PricePoint, Horizon, CryptoCurrency, AlertSetting } from '../types';

interface DashboardProps {
  symbol: string;
  setSymbol: (symbol: string) => void;
  horizon: Horizon;
  setHorizon: (horizon: Horizon) => void;
  onDataRequest: (symbol: string, horizon: Horizon) => void;
  forecastData: ApiResponse | null;
  priceData: PricePoint[];
  livePrice: number | null;
  loading: boolean;
  selectedCrypto: CryptoCurrency;
  alertSettings: AlertSetting[];
  onAlertSettingsChange: (settings: AlertSetting[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  symbol,
  setSymbol,
  horizon,
  setHorizon,
  onDataRequest,
  forecastData,
  priceData,
  livePrice,
  loading,
  selectedCrypto,
  alertSettings,
  onAlertSettingsChange,
}) => {
  return (
    <div className="space-y-6">
      <Controls
        symbol={symbol}
        setSymbol={setSymbol}
        horizon={horizon}
        setHorizon={setHorizon}
        onDataRequest={onDataRequest}
        loading={loading}
        livePrice={livePrice}
      />

      <div className="grid grid-cols-12 gap-6">
        <section aria-labelledby="price-chart-heading" className="col-span-12 lg:col-span-8 xl:col-span-9 bg-brand-surface border border-brand-border rounded-lg p-4 md:p-6">
          {loading ? (
             <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center">
                <SkeletonLoader className="w-full h-full" />
             </div>
          ) : (
            <>
                <h2 id="price-chart-heading" className="text-lg font-bold text-white mb-4">
                    {selectedCrypto.name} ({selectedCrypto.id}) Price and Forecast
                </h2>
                <PriceChart priceData={priceData} />
            </>
          )}
        </section>

        <aside aria-label="Forecast details" className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
           {loading ? (
            <>
              <SkeletonLoader className="h-48 w-full" />
              <SkeletonLoader className="h-64 w-full" />
              <SkeletonLoader className="h-56 w-full" />
            </>
           ) : forecastData ? (
             <>
                <ForecastPanel data={forecastData} />
                <RecommendationPanel data={forecastData.recommendation} />
                <InfoPanel backtest={forecastData.backtest} scenarios={forecastData.scenarios} />
             </>
           ) : null}
        </aside>

        <section aria-labelledby="features-heading" className="col-span-12 lg:col-span-7 bg-brand-surface border border-brand-border rounded-lg p-4 md:p-6">
             {loading ? <SkeletonLoader className="h-60 w-full" /> : forecastData ? <FeaturesPanel features={forecastData.top_features} /> : null}
        </section>

        <section aria-labelledby="alerts-manager-heading" className="col-span-12 lg:col-span-5">
            <AlertsManager 
                symbol={symbol} 
                alertSettings={alertSettings} 
                onSettingsChange={onAlertSettingsChange} 
            />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;