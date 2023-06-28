import * as React from 'react';
import { fetchBlogPost } from '../../lib/contentful';
import { Layout } from '../../components/layout/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    let currentLocale = locale ?? 'en';
    return {
        props: {
        ...(await serverSideTranslations(currentLocale, [
            'common'
        ]))
        },
    }
}

export default function BlogPost () {
    const router = useRouter();
    const { slug } = router.query;

    const [blogFields, setBlogFields] = useState<Awaited<ReturnType<typeof fetchBlogPost>>>();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        if (slug) fetchBlogPostDetails(signal);
        return () => controller.abort();
    }, [slug]);

    async function fetchBlogPostDetails (signal: AbortSignal) {
        try {
            const id = typeof slug === 'string' ? slug.split("-").slice(-1)[0] : '';
            if (id) {
                let response = await fetchBlogPost( id, signal );
                if (!response) throw "ID Not Found";
                setBlogFields(response);
            } else {
                throw "Malformed URL";
            };
        } catch (error) {
            console.error(error);
            router.push('/404');
        }
    }
    
    return (
        <Layout pageTitle={blogFields?.title ?? ''}>
            <h1 className='font-semibold text-2xl mb-5'>{blogFields?.title}</h1>
            <img 
                className='mb-5'
                src={blogFields?.featuredImage.url} 
                alt="" />
            <p className='text-xl text-gray-500 italic'>{blogFields?.subheading}</p>
            {blogFields && 
                <div className='blog mt-8'  
                     dangerouslySetInnerHTML={{ __html: documentToHtmlString(blogFields.body.json) }}></div>}
        </Layout>
    );
}
