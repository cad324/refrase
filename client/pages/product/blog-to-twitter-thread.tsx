import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { Tweet, TweetCard } from '../../components/product/TweetCard';
import { isValidUrl } from '../../lib/strings';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface ThreadResponse {
    tweets?: string[];
    error?: unknown;
    code?: number;
}

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

export const BlogToThreadPage = () => {
    const { t } = useTranslation('common');
    const { title, description } = {
        title: t('products.blogToThread'),
        description: t('products.blogToThreadDesc')
    };

    const blogLinkRef = useRef<HTMLInputElement>(null);
    const numOfTweetsRef = useRef<HTMLInputElement>(null);
    const toneRef = useRef<HTMLInputElement>(null);

    const [loadingResults, setLoadingResults] = useState(false);
    const [isGenerateBtnEnabled, setGenerateBtnEnabled] = useState(false);
    const [tweets, setTweets] = useState<Tweet[]>([]);

    const generateTweets = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setTweets([]);
        try {
            setLoadingResults(true);
            const response = await fetch('/api/generateThread', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: blogLinkRef.current?.value,
                        tweetCount: parseInt(numOfTweetsRef.current?.value ?? '0'),
                        tone: toneRef.current?.value ? toneRef.current.value : 'informative'
                    })
                });
            const {error, tweets}: ThreadResponse = await response.json();
            if (error) throw error;
            setTweets(tweets ?? []);
        } catch (error) {
            console.log(error);
        }
        setLoadingResults(false);
    }

    useEffect(() => {
        const checkInputs = (): void => {
            const urlFilled = isValidUrl(blogLinkRef.current?.value ?? '');
            const numOfTweetsFilled = numOfTweetsRef.current?.value !== '';

            if (parseInt(numOfTweetsRef.current?.value ?? '0') >= 2 && parseInt(numOfTweetsRef.current?.value ?? '0') <= 25) {
                setGenerateBtnEnabled(urlFilled && numOfTweetsFilled);
            } else setGenerateBtnEnabled(false);

            blogLinkRef.current?.addEventListener('input', checkInputs);
            numOfTweetsRef.current?.addEventListener('input', checkInputs);
        }

        checkInputs();

        return () => {
            blogLinkRef.current?.removeEventListener('input', checkInputs);
            numOfTweetsRef.current?.removeEventListener('input', checkInputs);
          };
    }, []);

    return (
        <Layout pageTitle={title}>
            <h1 className='font-semibold text-3xl mb-4'>{title}</h1>
            <p className='mb-8'>{description}</p>
            <div className='flex justify-evenly w-full'>
                <form className='shadow-sm bg-white p-5 rounded-lg h-fit-content grow' onSubmit={(e) => generateTweets(e)}>
                    <div className='mb-4'>
                        <label htmlFor='blog-url' className='block mb-1 font-semibold'>Blog Post Link </label>
                        <input required ref={blogLinkRef} id="blog-url" className='border rounded border-gray-light w-full p-2' />
                    </div>
                    <div className='mb-3'> 
                        <label className='font-semibold' htmlFor="tweet-count">Number of Tweets </label>
                        <input 
                            required
                            id="tweet-count"
                            ref={numOfTweetsRef}
                            className='px-2 border rounded border-gray-light ml-2' 
                            type='number' min={2} max={25} defaultValue={5} />
                        <Tippy
                            content={`Please select a number between 3 and 25`}
                            duration={[200, 200]}
                        >
                            <QuestionMarkCircleIcon id="help-tweet-count" color='white' className='h-6 w-6 inline fill-gray-dark hover:fill-black duration-200 outline-none ml-3' />
                        </Tippy>
                    </div>
                    <div className='mb-4'>
                        <label className='font-semibold' htmlFor="tone">Tone </label>
                        <input 
                            id="tone"
                            ref={toneRef}
                            className='border rounded border-gray-light w-full p-2' 
                            placeholder={`Ex: Informative, persuasive, etc.`} />
                    </div>
                    <div className='mt-8'>
                        <button disabled={!isGenerateBtnEnabled} className={`btn-primary disabled:bg-gray outline-none ${loadingResults && 'pointer-events-none'}`} type='submit'>
                            {loadingResults ? 
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-4 border-t-2 border-b-1 border-white rounded-full" viewBox="0 0 24 24">
                                    </svg>
                                    <span>{`Please wait...`}</span>
                                </>
                                : t('products.generateTweets')}
                        </button>
                    </div>
                </form>
                <div className={`overflow-y-scroll grow-2 ${tweets.length ? 'pl-5 h-screen' : 'flex h-auto'} border-l-2 border-gray ml-5 border-opacity-10 justify-center items-center`}>
                    {tweets.length ? 
                        tweets.map((tweet, i) => <TweetCard key={`tweet-${i}`} content={tweet} />)
                        : <span className='text-gray-dark text-xl'>{`Thread preview will appear here`}</span>}
                </div>
            </div>
        </Layout>
    );
}

export default BlogToThreadPage;