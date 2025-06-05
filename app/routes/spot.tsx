import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import styles from '../styles/spot.module.css';
import '../styles/spot.css';

const Spot = () => {
  const { onRouteChange } = useNav();

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/spot",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/spot"
    >
      <div className={styles.spotContainer}>
        <div className="trading-layout">
          {/* Header dengan informasi pair dan harga */}
          <div className="trading-header">
            <div className="pair-info">
              <h2>LAUNCHCOIN</h2>
              <div className="price-info">
                <span className="current-price">$0.14345</span>
                <span className="price-change positive">+31.91%</span>
              </div>
            </div>
            <div className="trading-actions">
              <button className="action-btn buy-btn">Buy</button>
              <button className="action-btn sell-btn">Sell</button>
            </div>
          </div>

          {/* Area grafik utama */}
          <div className="chart-container">
            <div className="chart-placeholder">Chart Area</div>
          </div>

          {/* Panel order dan informasi */}
          <div className="trading-panels">
            {/* Panel kiri - Order Form */}
            <div className="order-panel">
              <div className="panel-header">
                <div className="tab-group">
                  <button className="tab-btn active">Instant</button>
                  <button className="tab-btn">Trigger</button>
                  <button className="tab-btn">Recurring</button>
                </div>
              </div>
              <div className="panel-content">
                <div className="order-form">
                  <div className="form-group">
                    <label>Selling</label>
                    <div className="input-with-select">
                      <input type="text" placeholder="0.00" />
                      <select>
                        <option>SOL</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Buying</label>
                    <div className="input-with-select">
                      <input type="text" placeholder="0.00" />
                      <select>
                        <option>LAUNCHCOIN</option>
                      </select>
                    </div>
                  </div>
                  <button className="connect-wallet-btn">Connect</button>
                </div>
              </div>
            </div>

            {/* Panel kanan - Transactions */}
            <div className="transactions-panel">
              <div className="panel-header">
                <div className="tab-group">
                  <button className="tab-btn active">Transactions</button>
                  <button className="tab-btn">History</button>
                  <button className="tab-btn">Orders</button>
                </div>
              </div>
              <div className="panel-content">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Time/Age</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Volume</th>
                      <th>Trader</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Baris data akan diisi dari backend */}
                    <tr>
                      <td>7s</td>
                      <td className="buy-type">Buy</td>
                      <td>$0.14345</td>
                      <td>1.7K</td>
                      <td>MTL_VWX</td>
                    </tr>
                    <tr>
                      <td>30s</td>
                      <td className="buy-type">Buy</td>
                      <td>$0.14291</td>
                      <td>1.0K</td>
                      <td>MTL_VWX</td>
                    </tr>
                    <tr>
                      <td>37s</td>
                      <td className="buy-type">Buy</td>
                      <td>$0.14290</td>
                      <td>899.88</td>
                      <td>MTL_VWX</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Informasi tambahan */}
          <div className="market-info">
            <div className="info-card">
              <h3>Community Metrics</h3>
              <div className="metrics-content">
                <div className="metric-item">
                  <span className="metric-label">24h Volume</span>
                  <span className="metric-value">$1.63M</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Market Cap</span>
                  <span className="metric-value">$3.54M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveScaffold>
  );
};

export default Spot;