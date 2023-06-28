import * as React from 'react';
import { BlogPostSkeleton } from '../../lib/contentful';
import { formatDate } from '../../lib/datetime';
import { useTranslation } from 'react-i18next';

type BlogPreviewProps = Omit<BlogPostSkeleton['fields'], 'body'> & {latest: boolean};

export const BlogPreview = (props: BlogPreviewProps) => {
    const { title, subheading, postedDate, tags, author, slug, 
            readTime, featuredImage, latest, sys } = props;
    const { id } = sys;
    const { t } = useTranslation('common');
    return (
        <div className={`p-5 flex ${latest ? 'col-span-3 flex-row' : 'flex-col'} items-center shadow-sm bg-gray-50`}>
            <div className={`mb-3 ${latest ? 'mr-5 mb-0' : ''}`}>
                <a href={`/blog/${slug}-${id}`}>
                    <img src={featuredImage.url}
                        alt={featuredImage.description} />
                </a>
            </div>
            <div className='w-full self-start'>
                <a href={`/blog/${slug}-${id}`}>
                    <h2 className='font-semibold text-lg mb-3'>{title}</h2>
                </a>
                <a href={`/blog/${slug}-${id}`}>
                    <p className='mb-8'>{subheading}</p>
                </a>
                <div className='flex'>
                    <span className='mr-3'>
                        <img className='w-12 h-12 rounded-full' 
                             src={author.avatar.url} 
                             alt={`${author.firstName} ${author.surname}`} />
                    </span>
                    <span>
                        <p className='text-gray-600'>
                            {`${author.firstName} ${author.surname}`}
                        </p>
                        <p className='text-xs text-gray-600'>
                            {`${formatDate(postedDate)} · ${readTime} ${t('minRead')}`}
                        </p>
                    </span>
                </div> 
            </div>
        </div>
    );
}