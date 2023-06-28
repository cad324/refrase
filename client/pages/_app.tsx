import { appWithTranslation } from 'next-i18next'
import { AppProps } from 'next/app'
import React from 'react';
import nextI18NextConfig from '../next-i18next.config.js'
import '../styles/global.scss';
import store from '../store';
import { Provider } from 'react-redux';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default appWithTranslation(MyApp, nextI18NextConfig);