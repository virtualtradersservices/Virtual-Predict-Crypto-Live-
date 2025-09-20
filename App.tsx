import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import AlertsDisplay from './components/AlertsDisplay';
import { getMockForecastData, fetchLivePrice } from './services/cryptoService';
import type { ApiResponse, PricePoint, Horizon, AlertSetting, TriggeredAlert } from './types';
import { CRYPTOCURRENCIES, HORIZONS } from './constants';

const App: React.FC = () => {
  const [symbol, setSymbol] = useState<string>(CRYPTOCURRENCIES[0].id);
  const [horizon, setHorizon] = useState<Horizon>(HORIZONS[0].value);
  const [forecastData, setForecastData] = useState<ApiResponse | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);

  const prevForecastData = useRef<ApiResponse | null>(null);

  const fetchForecast = useCallback(async (sym: string, hor: Horizon) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch live price from CoinGecko
      const currentPrice = await fetchLivePrice(sym);
      setLivePrice(currentPrice);

      // 2. Generate mock forecast anchored to the live price
      const data = await getMockForecastData(sym, hor, currentPrice);
      setForecastData(data.apiResponse);
      setPriceData(data.priceHistory);

    } catch (err) {
      setError('Failed to fetch forecast data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!forecastData || !priceData.length) return;

    const newAlerts: TriggeredAlert[] = [];
    const latestPrice = livePrice ?? priceData[priceData.length - 1].point ?? priceData[priceData.length - 1].close ?? 0;
    
    alertSettings.forEach(setting => {
      if (setting.symbol !== forecastData.symbol) return;
      
      const isAlreadyTriggered = triggeredAlerts.some(a => a.settingId === setting.id);
      if (isAlreadyTriggered) return;

      const { condition } = setting;
      let triggered = false;
      let message = '';
      
      switch (condition.type) {
        case 'price':
          if (condition.direction === 'above' && latestPrice > condition.value) {
            triggered = true;
            message = `${forecastData.symbol} price crossed above ${condition.value.toLocaleString()}`;
          } else if (condition.direction === 'below' && latestPrice < condition.value) {
            triggered = true;
            message = `${forecastData.symbol} price crossed below ${condition.value.toLocaleString()}`;
          }
          break;
        case 'confidence':
          if (condition.direction === 'above' && forecastData.confidence > condition.value) {
            triggered = true;
            message = `${forecastData.symbol} forecast confidence is above ${(condition.value * 100).toFixed(0)}%`;
          } else if (condition.direction === 'below' && forecastData.confidence < condition.value) {
            triggered = true;
            message = `${forecastData.symbol} forecast confidence is below ${(condition.value * 100).toFixed(0)}%`;
          }
          break;
        case 'recommendation':
          if (prevForecastData.current && prevForecastData.current.symbol === forecastData.symbol && prevForecastData.current.recommendation.action !== forecastData.recommendation.action) {
            triggered = true;
            message = `${forecastData.symbol} recommendation changed from ${prevForecastData.current.recommendation.action.toUpperCase()} to ${forecastData.recommendation.action.toUpperCase()}`;
          }
          break;
      }
      
      if (triggered) {
        newAlerts.push({
          id: `triggered-${Date.now()}-${Math.random()}`,
          message,
          timestamp: Date.now(),
          settingId: setting.id,
        });
      }
    });

    if (newAlerts.length > 0) {
      setTriggeredAlerts(prev => [...prev, ...newAlerts]);
    }
    
    prevForecastData.current = forecastData;
    
  }, [forecastData, priceData, alertSettings, triggeredAlerts, livePrice]);

  useEffect(() => {
    fetchForecast(symbol, horizon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleControlChange = (newSymbol: string, newHorizon: Horizon) => {
    fetchForecast(newSymbol, newHorizon);
  };
  
  const handleDismissAlert = (id: string) => {
    setTriggeredAlerts(alerts => alerts.filter(a => a.id !== id));
  };
  
  const selectedCrypto = CRYPTOCURRENCIES.find(c => c.id === symbol) || CRYPTOCURRENCIES[0];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <AlertsDisplay alerts={triggeredAlerts} onDismiss={handleDismissAlert} />
        {error && (
          <div className="bg-brand-danger/20 border border-brand-danger text-white p-4 rounded-lg mb-6 text-center" role="alert">
            {error}
          </div>
        )}
        <Dashboard
          symbol={symbol}
          setSymbol={setSymbol}
          horizon={horizon}
          setHorizon={setHorizon}
          onDataRequest={handleControlChange}
          forecastData={forecastData}
          priceData={priceData}
          livePrice={livePrice}
          loading={loading}
          selectedCrypto={selectedCrypto}
          alertSettings={alertSettings}
          onAlertSettingsChange={setAlertSettings}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;