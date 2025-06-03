import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useNav } from "@/hooks/useNav";
import config from "@/utils/config";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { onRouteChange } = useNav();
  const [currentPath, setCurrentPath] = useState("/");
  
  // Update path saat URL berubah
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  
  // Tutup menu saat ukuran layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);
  
  // Handler untuk klik menu
  const handleMenuClick = (href) => {
    setIsOpen(false);
    
    // Gunakan onRouteChange dari useNav
    onRouteChange({ href });
  };
  
  return (
    <div className="oui-mobile-navbar">
      {/* Tombol Hamburger */}
      <button 
        className="oui-navbar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <div className={`hamburger ${isOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {/* Menu Mobile */}
      <div className={`oui-mobile-menu ${isOpen ? "open" : ""}`}>
        <nav>
          <ul>
            {config.scaffold.mainNavProps.mainMenus.map((menu, index) => (
              <li key={index}>
                <a
                  href={menu.href}
                  className={`oui-mobile-menu-item ${currentPath === menu.href ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(menu.href);
                  }}
                >
                  {menu.name}
                </a>
              </li>
            ))}
            
            {/* Tambahkan menu Rewards jika ada */}
            {config.scaffold.mainNavProps.campaigns && (
              <li>
                <a
                  href={config.scaffold.mainNavProps.campaigns.href}
                  className={`oui-mobile-menu-item ${currentPath === config.scaffold.mainNavProps.campaigns.href ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(config.scaffold.mainNavProps.campaigns.href);
                  }}
                >
                  {config.scaffold.mainNavProps.campaigns.name}
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}