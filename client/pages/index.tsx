import React from 'react';
import { Layout } from '../components/layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let currentLocale = locale ?? 'en';
  return {
    props: {
      ...(await serverSideTranslations(currentLocale, [
        'common'
      ]))
    },
  }
}

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const pageTitle = `${t('appName')} • ${t('home')}`;

  return (
      <Layout pageTitle={pageTitle}>
        <div>
          <h1>{t('welcome')}</h1>
        </div>
      </Layout>
    );
  };
  
  export default HomePage;