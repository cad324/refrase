const path = require('path');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        locales: ['en', 'fr'],
        defaultLocale: 'en'
    },
    localePath: path.resolve('./locales')
}