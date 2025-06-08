




export default function SpotPro() {
  return (

    <div className="w-full h-[calc(100vh-64px)]"> {/* 64px = tinggi navbar */}
      <iframe
        src="https://testproject-2d7fb.web.app/spot-pro"
        className="w-full h-full border-none"
        loading="lazy"
        title="spotpro"
      />
    </div>

  );
}

// Kode yang dikomentari dihapus untuk menjaga file tetap bersih
// import { useEffect, useRef } from 'react';
// import { createChart, AreaSeries, CandlestickSeries, createTextWatermark } from 'lightweight-charts';

// export default function ChartPage() {
//   const chartContainerRef = useRef(null);

//   useEffect(() => {
//     if (chartContainerRef.current) {
//       // Buat chart dengan opsi dasar
//       const chartOptions = {
//         layout: {
//           textColor: 'white',
//           background: {
//             type: 'solid',
//             color: '#1e1e2d'
//           }
//         },
//         grid: {
//           vertLines: {
//             color: 'rgba(197, 203, 206, 0.1)',
//           },
//           horzLines: {
//             color: 'rgba(197, 203, 206, 0.1)',
//           },
//         },
//         width: chartContainerRef.current.clientWidth,
//         height: 500,
//       };

//       const chart = createChart(chartContainerRef.current, chartOptions);

//       // Tambahkan area series
//       const areaSeries = chart.addSeries(AreaSeries, {
//         lineColor: '#2962FF',
//         topColor: '#2962FF',
//         bottomColor: 'rgba(41, 98, 255, 0.28)',
//       });

//       // Set data untuk area series
//       areaSeries.setData([
//         { time: '2018-12-22', value: 32.51 },
//         { time: '2018-12-23', value: 31.11 },
//         { time: '2018-12-24', value: 27.02 },
//         { time: '2018-12-25', value: 27.32 },
//         { time: '2018-12-26', value: 25.17 },
//         { time: '2018-12-27', value: 28.89 },
//         { time: '2018-12-28', value: 25.46 },
//         { time: '2018-12-29', value: 23.92 },
//         { time: '2018-12-30', value: 22.68 },
//         { time: '2018-12-31', value: 22.67 },
//       ]);

//       // Tambahkan candlestick series
//       const candlestickSeries = chart.addSeries(CandlestickSeries, {
//         upColor: '#26a69a',
//         downColor: '#ef5350',
//         borderVisible: false,
//         wickUpColor: '#26a69a',
//         wickDownColor: '#ef5350',
//       });

//       // Set data untuk candlestick series
//       candlestickSeries.setData([
//         { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
//         { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
//         { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
//         { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
//         { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
//         { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
//         { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
//         { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
//         { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
//         { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
//       ]);

//       // Sesuaikan skala waktu agar semua data terlihat
//       chart.timeScale().fitContent();

//       // Tambahkan watermark dengan nama LumaDex
//       const firstPane = chart.panes()[0];
//       const textWatermark = createTextWatermark(firstPane, {
//         horzAlign: 'center',
//         vertAlign: 'center',
//         lines: [
//           {
//             text: 'LumaDex',
//             color: 'rgba(255, 255, 255, 0.15)',
//             fontSize: 48,
//             fontFamily: 'Arial, sans-serif',
//             fontStyle: 'bold',
//           },
//         ],
//       });

//       // Tambahkan event listener untuk resize
//       const handleResize = () => {
//         chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//       };

//       window.addEventListener('resize', handleResize);

//       // Cleanup function
//       return () => {
//         window.removeEventListener('resize', handleResize);
//         chart.remove();
//       };
//     }
//   }, []);

//   return (
//     <div className="p-4 bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-white">LumaDex Chart</h1>

//       <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold text-white">LUMADEX</h2>
//           <p className="text-gray-400"></p>
//         </div>

//         <div
//           ref={chartContainerRef}
//           className="w-full h-[500px] rounded-md overflow-hidden"
//         />

//         <div className="mt-4 text-xs text-gray-500">
//           Powered by <a href="https://www.tradingview.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">TradingView</a>
//         </div>
//       </div>
//     </div>
//   );
// }
