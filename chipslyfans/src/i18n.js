// i18n.js
import { createI18n } from 'vue-i18n'
import de from './language/de.json'
import en from './language/en.json'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    de,
    en
  }
})