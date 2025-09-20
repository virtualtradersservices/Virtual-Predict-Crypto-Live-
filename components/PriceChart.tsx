
import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { PricePoint } from '../types';

interface PriceChartProps {
  priceData: PricePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isForecast = data.point !== undefined;
    const displayDate = new Date(data.timestamp).toLocaleString();

    return (
      <div className="bg-brand-surface/80 backdrop-blur-sm border border-brand-border p-3 rounded-lg text-sm shadow-lg">
        <p className="label text-brand-muted font-mono">{displayDate}</p>
        {isForecast ? (
          <div className="mt-2 space-y-1">
            <p className="text-brand-primary font-semibold">{`Forecast: ${data.point.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
            <p className="text-brand-secondary/80">{`Range (q10-q90): ${data.q10.toLocaleString()} - ${data.q90.toLocaleString()}`}</p>
          </div>
        ) : (
          <p className="text-brand-secondary mt-1">{`Close: ${data.close.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
        )}
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ priceData }) => {
  const formatYAxisTick = (tick: number) => {
    if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `${(tick / 1000).toFixed(1)}k`;
    return tick.toFixed(2);
  };

  const formatXAxisTick = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ width: '100%', height: 450 }}>
        <ResponsiveContainer>
            <ComposedChart data={priceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
            <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxisTick}
                stroke="#8B949E"
                tick={{ fontSize: 12, fill: '#8B949E' }}
                />
            <YAxis 
                orientation="right" 
                domain={['dataMin * 0.98', 'dataMax * 1.02']} 
                tickFormatter={formatYAxisTick}
                stroke="#8B949E"
                tick={{ fontSize: 12, fill: '#8B949E' }}
                />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />

            <defs>
                <linearGradient id="colorUncertainty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#58A6FF" stopOpacity={0.05}/>
                </linearGradient>
            </defs>

            <Area 
                type="monotone" 
                dataKey={(data) => [data.q10, data.q90]}
                fill="url(#colorUncertainty)" 
                stroke="none"
                name="Uncertainty Band"
                isAnimationActive={false}
            />

            <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#C9D1D9" 
                strokeWidth={2} 
                dot={false} 
                name="Price"
                connectNulls
                isAnimationActive={false}
                />
            <Line
                type="monotone"
                dataKey="point"
                stroke="#58A6FF"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Forecast"
                connectNulls
                isAnimationActive={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
