const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

i18next
    .use(Backend) // Load translations from files
    .use(middleware.LanguageDetector) // Detect user language
    .init({
        fallbackLng: 'en', // Default language
        preload: ['en', 'es'], // Preload supported languages
        backend: {
            loadPath: path.join(__dirname, '../locales/{{lng}}/translation.json'), // Path to translation files
        },
        detection: {
            order: ['querystring', 'cookie', 'header'], // Detect language from query, cookie, or header
            caches: ['cookie'], // Cache the language in a cookie
        },
    });

module.exports = i18next;
