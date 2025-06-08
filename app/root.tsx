

import React, { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import OrderlyProvider from "@/components/orderlyProvider";

import "./styles/index.css";
import "./styles/main.css";
import "./styles/navbar-responsive.css";
import "./styles/portfolio.css";
import "./styles/spot.css"

export function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skrip untuk hide-powered-by
    const hidePoweredByScript = document.createElement('script');
    hidePoweredByScript.id = 'hide-powered-by';
    hidePoweredByScript.textContent = `
      function hidePoweredBy() {
        const selectors = [
          '.oui-box.oui-flex.oui-flex-row.oui-items-center.oui-justify-start.oui-flex-nowrap.oui-gap-1',
          '.orderly-powered-by',
          '[class*="powered-by-orderly"]',
          '[class*="orderly-branding"]',
          '[class*="orderly-footer"]',
          '[class*="orderly-copyright"]',
          '.oui-footer-branding',
          '.oui-footer-powered-by',
          '.oui-footer-copyright',
          '[class*="tradingview-widget-copyright"]',
          '[class*="tv-copyright"]',
          '.tv-copyright-label'
        ];

        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el.querySelector('.oui-text-2xs')?.textContent.includes('Powered by') || 
                el.className.includes('powered-by') || 
                el.className.includes('orderly')) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.remove();
            }
          });
        });

        const dialogElements = document.querySelectorAll('.oui-dialog-content .oui-box.oui-flex, .oui-dialog-body .oui-box.oui-flex');
        dialogElements.forEach(el => {
          el.style.display = 'flex';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });
        
        // Fix logo visibility
        function fixLogo() {
          // Check for logo in navbar
          const navbarLogos = document.querySelectorAll('.oui-navbar-brand img, .oui-navbar img');
          navbarLogos.forEach(logo => {
            if (!logo.src || logo.src.includes('orderly-logo')) {
              logo.src = '/lu.svg';
              logo.style.display = 'block';
              logo.style.visibility = 'visible';
              logo.style.opacity = '1';
              logo.style.maxWidth = '100px';
              logo.style.maxHeight = '100px';
            }
          });
        }
        
        fixLogo();
        // Run logo fix periodically
        setInterval(fixLogo, 1000);
      }

      window.addEventListener('load', hidePoweredBy);
      setInterval(hidePoweredBy, 500);
    `;
    document.body.appendChild(hidePoweredByScript);

    // Skrip untuk setup-mobile-nav
    const mobileNavScript = document.createElement('script');
    mobileNavScript.id = 'setup-mobile-nav';
    mobileNavScript.textContent = `
      function setupMobileNav() {
        const toggleButton = document.querySelector('.oui-navbar-toggle');
        const mobileNav = document.querySelector('.oui-navbar-mobile');
        
        if (toggleButton && mobileNav) {
          toggleButton.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
          });
          
          const navItems = document.querySelectorAll('.oui-navbar-mobile .oui-navbar-item');
          navItems.forEach(item => {
            item.addEventListener('click', function() {
              mobileNav.classList.remove('open');
            });
          });
        }
      }

      document.addEventListener('DOMContentLoaded', setupMobileNav);
      window.addEventListener('load', setupMobileNav);
    `;
    document.body.appendChild(mobileNavScript);

    // Cleanup
    return () => {
      document.body.removeChild(hidePoweredByScript);
      document.body.removeChild(mobileNavScript);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <OrderlyProvider>{children}</OrderlyProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}