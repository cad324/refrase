import React, { useState } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon, DocumentDuplicateIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../lib/datetime';

export type Tweet = string;

interface TweetProps {
    content: Tweet
}

export function TweetCard ({content}: TweetProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        navigator.clipboard.writeText(content)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className='bg-white shadow ring-1 ring-gray-light dark:border-gray-800 p-4 rounded-xl max-w-2xl mb-6'>
            <div className='flex'>
                <div className='mb-4'>
                    <img src='/images/blank-profile.svg' className='w-10 rounded-full mr-2' alt='' />
                </div>
                <div>
                    <p className='font-semibold text-sm'>Username</p>
                    <p className='font-light text-xs'>@username</p>
                </div>
            </div>
            <p>{content}</p>
            <p className='text-gray dark:text-gray-400 text-xs my-2'>{`09:25 • ${formatDate(new Date())} • Earth`}</p>
            <div className='border-gray-light border border-b-0 mt-1 mb-2' ></div>
            <div className='flex justify-between'>
                <div className='flex w-1/2'>
                    <div className='flex mr-6'>
                        <HeartIcon className="h-5 w-5 text-gray mr-2" />
                        <p className='text-gray-dark text-sm'>638</p>
                    </div>
                    <div className='flex'>
                        <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray mr-2" />
                        <p className='text-gray-dark text-sm'>74</p>
                    </div>
                </div>
                <button onClick={handleCopy} className={`rounded-xl px-2 py-1.5 text-xs text-gray-dark border cursor-pointer flex ${copied ? 'bg-green bg-opacity-50 border-green' : 'bg-gray-light border-gray-light'}`}>
                    <p>{copied ? `Copied!` : `Copy Tweet`}</p>
                    {
                        copied ?
                        <ClipboardDocumentCheckIcon className='h-4 w-4 ml-1'/> :
                        <DocumentDuplicateIcon className='h-4 w-4 ml-1'/>
                    }
                </button>
            </div>
            
        </div>
    );
}

export default TweetCard;
