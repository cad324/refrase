import Header from './Header';
import Footer from './Footer';
import React, { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode,
    pageTitle: string
}

export const Layout = ({children, pageTitle}: LayoutProps): JSX.Element => {
    return (
        <div className='min-h-screen relative'>
            <Header title={pageTitle}/>
            <main className='p-10 pb-32 flex flex-col items-center max-w-6xl sm:px-6 lg:px-0 mx-auto h-'>
                {children}
            </main>
            <Footer/>
        </div>
    )
}