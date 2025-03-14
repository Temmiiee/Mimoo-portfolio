class Analytics {
    static init() {
        if (typeof window !== 'undefined') {
            this.trackPageView();
            this.setupEventListeners();
        }
    }

    static trackPageView() {
        const data = {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };
        this.sendData('pageview', data);
    }

    static trackEvent(category, action, label = null) {
        const data = {
            category,
            action,
            label,
            timestamp: new Date().toISOString()
        };
        this.sendData('event', data);
    }

    static setupEventListeners() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                this.trackEvent('Gallery', 'Image Click', item.querySelector('img').alt);
            });
        });

        document.querySelector('#contact-form').addEventListener('submit', () => {
            this.trackEvent('Contact', 'Form Submit');
        });
    }

    static sendData(type, data) {
        if (process.env.NODE_ENV === 'production') {
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            });
        }
    }
}

export default Analytics;