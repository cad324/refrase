import React from 'react';
import { useTranslation } from 'next-i18next';

interface FooterProps {
    
}

export default function Footer (props: FooterProps) {
    const { t } = useTranslation();
    const year = new Date().getFullYear();
    return (
        <footer className='footer bg-gray-dark w-full h-16 text-center absolute bottom-0 left-0 py-5 flex flex-col justify-center'>
            <p className='text-white font-extralight text-sm'>
                {`${t('copyright', { appName: t('appName'), year })}`}
            </p>
        </footer>
    );
}