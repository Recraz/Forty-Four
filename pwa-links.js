/**
 * PWA Link Handler for opening links within the PWA
 */
class PWALinkHandler {
    constructor() {
        this.isStandalone = this.isPWAStandalone();
        this.init();
    }

    /**
     * Check if the app is running in standalone mode (PWA)
     * @returns {boolean}
     */
    isPWAStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone || 
               document.referrer.includes('android-app://');
    }

    /**
     * Initialize the link handler
     */
    init() {
        // Handle all link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                this.handleLinkClick(event, link);
            }
        });
    }

    /**
     * Handle link click events
     * @param {Event} event - The click event
     * @param {HTMLAnchorElement} link - The clicked link element
     */
    handleLinkClick(event, link) {
        // Don't interfere with download links, or links that open in a new window
        if (link.hasAttribute('download') || link.getAttribute('target') === '_blank') {
            return;
        }

        // Check if it's an external link
        const isExternal = this.isExternalLink(link.href);
        
        // If it's an external link and we're in PWA mode, handle it appropriately
        if (isExternal && this.isStandalone) {
            event.preventDefault();
            this.openExternalLink(link.href);
        }
    }

    /**
     * Check if a URL is external (different domain)
     * @param {string} url - The URL to check
     * @returns {boolean}
     */
    isExternalLink(url) {
        try {
            const currentDomain = window.location.origin;
            return !url.startsWith(currentDomain);
        } catch (e) {
            // If there's an error parsing the URL, treat it as external
            return true;
        }
    }

    /**
     * Open an external link appropriately based on context
     * @param {string} url - The URL to open
     * @param {string} target - The target window (default: '_blank')
     */
    openExternalLink(url, target = '_blank') {
        // If we have service worker support, try to use it
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'openWindow',
                url: url,
                target: target
            });
        } else {
            // Fallback to regular window.open
            window.open(url, target);
        }
    }

    /**
     * Public method to programmatically open a link
     * @param {string} url - The URL to open
     * @param {string} target - The target window (default: '_blank')
     */
    openLink(url, target = '_blank') {
        if (this.isExternalLink(url) && this.isStandalone) {
            this.openExternalLink(url, target);
        } else {
            window.open(url, target);
        }
    }
}

// Initialize the link handler when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pwaLinkHandler = new PWALinkHandler();
    });
} else {
    window.pwaLinkHandler = new PWALinkHandler();
}