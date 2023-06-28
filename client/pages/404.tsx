import * as React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Layout } from '../components/layout/Layout';
import { ExclamationCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

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

interface Page404Props {}

const PageNotFound: React.FC = (props: Page404Props) => {
    const { t } = useTranslation('common');
    return (
        <Layout pageTitle={''}>
            <div className='pt-16 min-h-full flex flex-col'>
                <div className=''>
                    <ExclamationCircleIcon strokeWidth={1} className="h-16 w-16 red-300 mx-auto mb-16 text-warning" aria-hidden="true" />
                    <p className='font-semibold text-3xl'>
                        {t('notFoundTitle')}
                    </p>
                </div>
                <p className='my-10'>
                    {t('notFoundMsg')}
                </p>
                <div>
                    <a 
                        className='btn-secondary' 
                        href='/'
                    >
                        <span>{t('homepage')}</span>
                        <ArrowRightCircleIcon className='h-6 w-6 inline ml-4' />
                    </a>
                </div>
            </div> 
        </Layout>
    );
}

export default PageNotFound;
