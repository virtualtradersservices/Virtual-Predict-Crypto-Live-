import type { Horizon, CryptoCurrency } from './types';

export const CRYPTOCURRENCIES: CryptoCurrency[] = [
  { id: 'BTC/USDT', name: 'Bitcoin' },
  { id: 'ETH/USDT', name: 'Ethereum' },
  { id: 'SOL/USDT', name: 'Solana' },
  { id: 'BNB/USDT', name: 'BNB' },
  { id: 'XRP/USDT', name: 'XRP' },
  { id: 'DOGE/USDT', name: 'Dogecoin' },
  { id: 'ADA/USDT', name: 'Cardano' },
];

// Map app symbols to CoinGecko API IDs
export const COINGECKO_IDS: { [key: string]: string } = {
    'BTC/USDT': 'bitcoin',
    'ETH/USDT': 'ethereum',
    'SOL/USDT': 'solana',
    'BNB/USDT': 'binancecoin',
    'XRP/USDT': 'ripple',
    'DOGE/USDT': 'dogecoin',
    'ADA/USDT': 'cardano',
};

export const HORIZONS: { label: string; value: Horizon }[] = [
  { label: '1 Hour', value: '1h' },
  { label: '4 Hours', value: '4h' },
  { label: '1 Day', value: '1d' },
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
];