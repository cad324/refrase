import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import ProductPreview, { ProductPreviewProps } from '../../components/product/ProductPreview';

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

export interface ProductProps {
}

export const ProductPage: React.FC = (props: ProductProps) => {
    const { t } = useTranslation('common');

    const products: ProductPreviewProps[] = [
        {
            title: t('products.blogToThread'),
            description: t('products.blogToThreadDesc'),
            slug: 'blog-to-twitter-thread'
        }
    ];

    return (
        <Layout pageTitle={`${t('appName')} • ${t('product')}`}>
            <div>
                {products && products.map(prod =>
                    <ProductPreview key={prod.slug} {...prod}/>)}
            </div>
        </Layout>
    );
}

export default ProductPage;