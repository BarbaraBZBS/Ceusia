import './globals.css'
// import { Inter } from 'next/font/google'
import AppNav from '../components/appnav'
import Footer from '../components/footer'
import Provider from './Provider'


// const inter = Inter( { subsets: [ 'latin' ], weight: [ '300' ] } )

export const metadata = {
    title: 'Ceusia',
    description: 'A place to share',
}

export default function RootLayout( { children } ) {
    return (
        <html lang="en">
            <body >
                <Provider>
                    <AppNav />
                    { children }
                    <Footer />
                </Provider>
            </body>
        </html>
    )
}
//body className={ inter.className }