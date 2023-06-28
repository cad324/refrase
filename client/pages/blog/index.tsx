import React, { useEffect, useState } from 'react';
import { fetchBlogPreviews } from '../../lib/contentful';
import { Layout } from '../../components/layout/Layout';
import { BlogPreview } from '../../components/blog/BlogPreview';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
  const [blogPosts, setBlogPosts] = useState<Awaited<ReturnType<typeof fetchBlogPreviews>>>([]);

  const pageTitle = `${t('appName')} • ${t('blog')}`;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchPreviews(signal);
    return () => controller.abort();
  }, []);

  async function fetchPreviews (signal: AbortSignal) {
    const previews = await fetchBlogPreviews(signal);
    setBlogPosts(previews);
  }

  return (
    <Layout pageTitle={pageTitle}>
      <h1
        className='text-center font-semibold text-xl mb-10'
      >
        { t('blog') }
      </h1>
      <div className='grid grid-cols-3 gap-5 grid-flow-row max-w-6xl sm:px-6 lg:px-0'>
        {blogPosts.map((fields, index) => (
          <BlogPreview
            key={fields.slug}
            latest={index === 0}
            {...fields} />
        ))}
      </div>
    </Layout>
  );
};
  
export default HomePage;