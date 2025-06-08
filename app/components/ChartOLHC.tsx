// app/components/ChartOLHC.tsx
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/fb';

interface OHLCData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export default function ChartOLHC() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Buat chart dengan opsi dasar menggunakan theme variables
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { type: 'solid', color: 'rgb(var(--oui-color-base-8))' },
                textColor: 'rgb(var(--oui-color-base-foreground))'
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                timeVisible: true,
            },
            crosshair: {
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    width: 1,
                    style: 0,
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    width: 1,
                    style: 0,
                },
            },
        });

        // Buat candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: 'rgb(var(--oui-color-success))',
            downColor: 'rgb(var(--oui-color-danger))',
            borderVisible: false,
            wickUpColor: 'rgb(var(--oui-color-success))',
            wickDownColor: 'rgb(var(--oui-color-danger))',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // Resize handler
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth 
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Subscribe ke data OHLC dari Firebase
        const ohlcQuery = query(
            collection(db, 'ohlc_data'),
            orderBy('time', 'asc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(ohlcQuery, (snapshot) => {
            const ohlcData: OHLCData[] = snapshot.docs.map(doc => ({
                time: doc.data().time.seconds,
                open: doc.data().open,
                high: doc.data().high,
                low: doc.data().low,
                close: doc.data().close,
            }));

            // Jika tidak ada data, tambahkan data dummy untuk testing
            if (ohlcData.length === 0) {
                const now = Math.floor(Date.now() / 1000);
                const dummyData: OHLCData[] = [];

                for (let i = 0; i < 30; i++) {
                    const basePrice = 100 + Math.random() * 10;
                    const volatility = basePrice * 0.05;
                    
                    dummyData.push({
                        time: now - (30 - i) * 3600,
                        open: basePrice - volatility / 2 + Math.random() * volatility,
                        high: basePrice + volatility / 2 + Math.random() * volatility,
                        low: basePrice - volatility - Math.random() * volatility,
                        close: basePrice - volatility / 2 + Math.random() * volatility,
                    });
                }

                if (seriesRef.current) {
                    seriesRef.current.setData(dummyData);
                }
            } else if (seriesRef.current) {
                seriesRef.current.setData(ohlcData);
            }
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, []);

    return (
        <div className="chart-container" ref={chartContainerRef}></div>
    );
}