'use client';

import { useEffect } from 'react';

export function NetlifyBadgeRemover() {
  useEffect(() => {
    const purgeNetlifyBadges = () => {
      // 1. Selector-based removal for known Netlify injected widgets, badges, and drawers
      const selectors = [
        'netlify-drawer',
        '#netlify-badge',
        '.netlify-badge',
        '[data-netlify-drawer]',
        '[data-netlify-badge]',
        '[data-testid="netlify-drawer"]',
        'iframe#netlify-drawer',
        'iframe[src*="netlify"]',
        'div[id*="netlify-drawer"]',
        'div[class*="netlify-drawer"]',
        'div[id*="netlify-badge"]',
        'div[class*="netlify-badge"]',
      ];

      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          try {
            el.remove();
          } catch {
            // Element already removed
          }
        });
      });

      // 2. Scan fixed-positioned links and badges (e.g. "Powered by Netlify")
      document.querySelectorAll('a[href*="netlify.com"], a[href*="netlify.app"]').forEach((el) => {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          const text = (el.textContent || '').toLowerCase();
          if (
            style.position === 'fixed' ||
            style.position === 'sticky' ||
            text.includes('powered by netlify') ||
            text.includes('netlify') ||
            el.className.includes('netlify')
          ) {
            try {
              el.remove();
            } catch {
              // Ignore
            }
          }
        }
      });
    };

    // Run purge immediately
    purgeNetlifyBadges();

    // Observe DOM mutations to prevent dynamic injection during page lifecycle
    const observer = new MutationObserver((mutations) => {
      let shouldPurge = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              const tag = node.tagName.toLowerCase();
              const id = node.id.toLowerCase();
              const className = typeof node.className === 'string' ? node.className.toLowerCase() : '';
              if (
                tag.includes('netlify') ||
                id.includes('netlify') ||
                className.includes('netlify') ||
                (node.textContent && node.textContent.toLowerCase().includes('powered by netlify'))
              ) {
                shouldPurge = true;
                break;
              }
            }
          }
        }
        if (shouldPurge) break;
      }

      if (shouldPurge) {
        purgeNetlifyBadges();
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
