import 'react-i18next';
import translationEN from '../../public/locales/en/translation.json';

declare module 'react-i18next' {
  type DefaultResources = typeof translationEN;
  interface Resources extends DefaultResources {}
}
