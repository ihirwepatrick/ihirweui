// Framer Link Control Script
// Paste this code into your Framer project's custom code section (Head or Body)

(function() {
  'use strict';
  
  // Route mapping for your domain
  const MAIN_DOMAIN = 'https://ihirwe.art';
  const FRAMER_DOMAIN = 'https://ihirweui.framer.website';
  
  // Function to convert Framer URLs to your domain URLs
  function convertToMainDomain(url) {
    if (url.startsWith(FRAMER_DOMAIN)) {
      return url.replace(FRAMER_DOMAIN, MAIN_DOMAIN);
    }
    return url;
  }
  
  // Function to notify parent window of navigation
  function notifyParentNavigation(path) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'framer-navigation',
        path: path
      }, MAIN_DOMAIN);
    }
  }
  
  // Override all link clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    
    if (link && link.href) {
      // Check if it's an internal Framer link
      if (link.href.startsWith(FRAMER_DOMAIN) || link.href.startsWith('/')) {
        e.preventDefault();
        
        let targetPath = link.href;
        if (targetPath.startsWith(FRAMER_DOMAIN)) {
          targetPath = targetPath.replace(FRAMER_DOMAIN, '');
        }
        
        // Navigate within the iframe
        window.location.href = FRAMER_DOMAIN + targetPath;
        
        // Notify parent to update URL
        notifyParentNavigation(targetPath);
      }
      // Let external links work normally
    }
  }, true);
  
  // Disable right-click context menu on links to prevent "Open in new tab"
  document.addEventListener('contextmenu', function(e) {
    const link = e.target.closest('a');
    if (link && (link.href.startsWith(FRAMER_DOMAIN) || link.href.startsWith('/'))) {
      e.preventDefault();
      
      // Optional: Show custom context menu or notification
      console.log('Right-click disabled on internal links to maintain domain consistency');
    }
  });
  
  // Override middle-click (wheel click) on links
  document.addEventListener('mousedown', function(e) {
    if (e.button === 1) { // Middle mouse button
      const link = e.target.closest('a');
      if (link && (link.href.startsWith(FRAMER_DOMAIN) || link.href.startsWith('/'))) {
        e.preventDefault();
        
        // Navigate normally instead of opening new tab
        let targetPath = link.href;
        if (targetPath.startsWith(FRAMER_DOMAIN)) {
          targetPath = targetPath.replace(FRAMER_DOMAIN, '');
        }
        
        window.location.href = FRAMER_DOMAIN + targetPath;
        notifyParentNavigation(targetPath);
      }
    }
  });
  
  // Disable keyboard shortcuts that could open links in new tabs
  document.addEventListener('keydown', function(e) {
    const link = document.activeElement;
    
    if (link && link.tagName === 'A' && (link.href.startsWith(FRAMER_DOMAIN) || link.href.startsWith('/'))) {
      // Disable Ctrl+Click, Cmd+Click, Ctrl+Enter, etc.
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.type === 'click')) {
        e.preventDefault();
        
        let targetPath = link.href;
        if (targetPath.startsWith(FRAMER_DOMAIN)) {
          targetPath = targetPath.replace(FRAMER_DOMAIN, '');
        }
        
        window.location.href = FRAMER_DOMAIN + targetPath;
        notifyParentNavigation(targetPath);
      }
    }
  });
  
  // Notify parent of current page on load
  window.addEventListener('load', function() {
    const currentPath = window.location.pathname;
    notifyParentNavigation(currentPath);
  });
  
  console.log('Framer Link Control: Initialized successfully');
})();


