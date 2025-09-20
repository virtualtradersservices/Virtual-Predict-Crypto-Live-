import { COINGECKO_IDS } from '../constants';
import type { ApiResponse, Horizon, PricePoint, Recommendation } from '../types';

const MOCK_PRICES: { [key: string]: number } = {
    'BTC/USDT': 115000,
    'ETH/USDT': 5500,
    'SOL/USDT': 350,
    'BNB/USDT': 900,
    'XRP/USDT': 0.8,
    'DOGE/USDT': 0.25,
    'ADA/USDT': 0.60,
};

export const fetchLivePrice = async (symbol: string): Promise<number | null> => {
    const coingeckoId = COINGECKO_IDS[symbol];
    if (!coingeckoId) {
        console.error(`No CoinGecko ID found for symbol: ${symbol}`);
        return null;
    }
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`CoinGecko API request failed with status ${response.status}`);
        }
        const data = await response.json();
        const price = data[coingeckoId]?.usd;
        return typeof price === 'number' ? price : null;
    } catch (error) {
        console.error("Failed to fetch live price from CoinGecko:", error);
        return null;
    }
};

const HORIZON_MULTIPLIERS: { [key in Horizon]: { volatility: number; points: number, timeStep: number } } = {
    '1h': { volatility: 0.005, points: 60, timeStep: 60 * 1000 },
    '4h': { volatility: 0.01, points: 96, timeStep: 15 * 60 * 1000 },
    '1d': { volatility: 0.02, points: 120, timeStep: 60 * 12 * 1000 },
    '1w': { volatility: 0.05, points: 168, timeStep: 24 * 60 * 60 * 1000 / 4 },
    '1m': { volatility: 0.1, points: 120, timeStep: 30 * 24 * 60 * 60 * 1000 / 120},
};

const generatePriceHistory = (startPrice: number, horizon: Horizon): PricePoint[] => {
    const history: PricePoint[] = [];
    let currentPrice = startPrice;
    const { points, timeStep } = HORIZON_MULTIPLIERS[horizon];
    const now = new Date().getTime();

    // Generate history backwards from the current time
    for (let i = points - 1; i >= 0; i--) {
        const timestamp = now - i * timeStep;
        const volatility = Math.random() * 0.02;
        // Reverse the price generation to end at the startPrice
        const move = (Math.random() - 0.5) * currentPrice * volatility;
        const close = currentPrice;
        const open = close - move;
        const high = Math.max(open, close) + Math.random() * currentPrice * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * currentPrice * volatility * 0.5;

        history.unshift({ // unshift to build the array in reverse
            timestamp,
            date: new Date(timestamp).toLocaleString(),
            open, high, low, close,
        });
        currentPrice = open;
    }
    // Ensure the last point is exactly the startPrice
    const lastPoint = history[history.length - 1];
    if(lastPoint) lastPoint.close = startPrice;

    return history;
};

const generateForecastData = (lastPrice: number, horizon: Horizon): PricePoint[] => {
    const forecast: PricePoint[] = [];
    let currentPrice = lastPrice;
    const { volatility, points, timeStep } = HORIZON_MULTIPLIERS[horizon];
    const forecastPoints = Math.floor(points * 0.25); // Forecast 1/4 of the history length
    const now = new Date().getTime();

    const trend = (Math.random() - 0.45); // slight bullish bias

    for (let i = 1; i <= forecastPoints; i++) {
        const timestamp = now + i * timeStep;
        const point = currentPrice * (1 + trend * volatility * (i / forecastPoints) + (Math.random() - 0.5) * volatility * 0.2);
        
        const spread = point * volatility * 1.5 * (Math.sqrt(i)/Math.sqrt(forecastPoints));
        forecast.push({
            timestamp,
            date: new Date(timestamp).toLocaleString(),
            point,
            q90: point + spread,
            q75: point + spread * 0.5,
            q50: point,
            q25: point - spread * 0.5,
            q10: point - spread,
        });
        currentPrice = point;
    }
    return forecast;
};

const mockTopFeatures = [
    { name: "orderbook_imbalance", value: 0.23, shap: 0.28 },
    { name: "funding_rate_zscore", value: 1.8, shap: 0.19 },
    { name: "exchange_inflow_1h", value: -450000, shap: 0.12 },
    { name: "social_sentiment_embed_dist", value: 0.9, shap: 0.08 },
    { name: "realized_vol_1d", value: 0.03, shap: 0.05 },
];

const mockRecommendations: Pick<Recommendation, 'action' | 'rationale'>[] = [
    { action: 'buy', rationale: 'Strong momentum and positive funding rates suggest upward potential.' },
    { action: 'sell', rationale: 'High exchange inflows and negative sentiment point to a potential correction.' },
    { action: 'hold', rationale: 'Market is consolidating; indicators are mixed. Await a clearer signal.' },
];

export const getMockForecastData = (symbol: string, horizon: Horizon, livePrice?: number | null): Promise<{ apiResponse: ApiResponse; priceHistory: PricePoint[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const startPrice = livePrice ?? MOCK_PRICES[symbol];
            const history = generatePriceHistory(startPrice, horizon);
            const lastClose = history.length > 0 ? history[history.length - 1].close! : startPrice;
            const forecastPoints = generateForecastData(lastClose, horizon);

            const firstForecast = forecastPoints[0];
            const finalForecast = forecastPoints[forecastPoints.length - 1];

            const recommendation = mockRecommendations[Math.floor(Math.random() * 3)];
            
            const apiResponse: ApiResponse = {
                symbol: symbol,
                horizon: horizon,
                timestamp: new Date().toISOString(),
                forecast: {
                    point: finalForecast.point!,
                    q10: finalForecast.q10!,
                    q25: finalForecast.q25!,
                    q50: finalForecast.q50!,
                    q75: finalForecast.q75!,
                    q90: finalForecast.q90!,
                },
                confidence: Math.random() * (0.9 - 0.6) + 0.6,
                model_id: "shadow-ensemble-v2.1-live",
                top_features: mockTopFeatures.sort(() => 0.5 - Math.random()),
                recommendation: {
                    ...recommendation,
                    size_pct: parseFloat((Math.random() * 3 + 1).toFixed(1)),
                    stop_loss_pct: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
                },
                backtest: {
                    period: "2024-01-01:2025-09-15",
                    sharpe: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
                    max_dd: parseFloat((-(Math.random() * 15 + 5)).toFixed(1)),
                },
                scenarios: {
                    diffusion_url: "https://app/api/scenario/xxx",
                    n_paths: 2000
                },
                explain_url: "https://app/api/explain/forecast/xxx",
                provenance: {
                    data_sources: ["coingecko_api", "binance_ws", "alchemy"],
                    feature_store_snapshot: `v${new Date().toISOString().split('T')[0]}`,
                    model_commit: `sha256:${(Math.random() + 1).toString(36).substring(2)}`
                },
                log_id: `cp-live-${new Date().getTime()}`
            };

            const combinedData = [...history, { ...history[history.length - 1], ...firstForecast, close: undefined, open: undefined, high: undefined, low: undefined }, ...forecastPoints.slice(1)];

            resolve({ apiResponse, priceHistory: combinedData });
        }, 500 + Math.random() * 500); // Simulate network delay for generation
    });
};