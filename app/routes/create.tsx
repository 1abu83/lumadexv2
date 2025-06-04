import { useState, useRef } from "react";
import { ChevronDown, Upload } from "lucide-react";
import ResponsiveScaffold from "@/components/ResponsiveScaffold";
import config from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import styles from '../styles/create.module.css';
import { useWallet } from "@solana/wallet-adapter-react";

const CreateTokenContent = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [supply, setSupply] = useState("");
  const [description, setDescription] = useState("");
  const [revokeFreeze, setRevokeFreeze] = useState(true);
  const [revokeMint, setRevokeMint] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Menggunakan wallet dari Solana wallet adapter
  const wallet = useWallet();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateToken = async () => {
    // Implementasi pembuatan token akan ditambahkan di sini
    console.log({
      tokenName,
      tokenSymbol,
      decimals,
      supply,
      description,
      revokeFreeze,
      revokeMint,
      selectedImage
    });
  };

  return (
    <div className={styles.formContainer}>
      {/* Form Fields */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className={styles.formInput}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Decimals</label>
          <input
            type="text"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Image</label>
          <div className={styles.imageUpload} onClick={handleImageClick}>
            {selectedImage ? (
              <img src={selectedImage} alt="Token" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '8px' }} />
            ) : (
              <Upload className={styles.uploadIcon} />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Supply</label>
        <input
          type="text"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textareaInput}
        />
      </div>

      {/* Toggle Options */}
      <div className={styles.toggleOption}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Revoke Freeze <span style={{ fontSize: '12px', opacity: 0.7 }}>(required)</span></span>
          <span className={styles.toggleDescription}>Revoke Freeze allows you to create a liquidity pool</span>
        </div>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={revokeFreeze}
            onChange={() => setRevokeFreeze(!revokeFreeze)}
          />
          <span className={styles.toggleSlider}></span>
        </label>
      </div>

      <div className={styles.toggleOption}>
        <div className={styles.toggleInfo}>
          <span className={styles.toggleTitle}>Revoke Mint</span>
          <span className={styles.toggleDescription}>Mint Authority allows you to increase tokens supply</span>
        </div>
        <label className={styles.toggleSwitch}>
          <input
            type="checkbox"
            checked={revokeMint}
            onChange={() => setRevokeMint(!revokeMint)}
          />
          <span className={styles.toggleSlider}></span>
        </label>
      </div>

      {/* SOL Amount */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <span className={styles.solAmount}>(0.1 SOL)</span>
      </div>

      {/* Show More Options Button */}
      <button
        className={styles.showMoreButton}
        onClick={() => setShowMoreOptions(!showMoreOptions)}
      >
        Show More Options <ChevronDown size={16} />
      </button>

      {/* Select Wallet Button */}
      <button
        className={styles.selectWalletButton}
        onClick={handleCreateToken}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default function CreateTokenPage() {
  const { onRouteChange } = useNav();

  return (
    <ResponsiveScaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/create",
      }}
      footerProps={config.scaffold.footerProps}
      currentPath="/create"
    >
      <div className={styles.createContainer}>
        <CreateTokenContent />
      </div>
    </ResponsiveScaffold>
  );
}