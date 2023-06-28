import * as React from 'react';

export interface ProductPreviewProps {
    title: string,
    description: string,
    slug: string
}

export function ProductPreview (props: ProductPreviewProps) {
    const { title, description, slug } = props;
  return (
    <div className='shadow-md p-5 bg-white rounded-xl max-w-md'>
        <a href={`product/${slug}`}>
            <h2 className='font-semibold text-lg mb-3'>
                {title}
            </h2>
            <p className='font-light text-sm'>
                {description}
            </p>
        </a>
    </div>
  );
}

export default ProductPreview;
