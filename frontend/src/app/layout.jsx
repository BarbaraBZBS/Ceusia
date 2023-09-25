import './globals.css';
import { Ysabeau_Office } from 'next/font/google'
import AppNav from '../components/appNav';
import Footer from '../components/footer';
import Provider from './Provider';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../pages/api/auth/[...nextauth]';
import AppLoad from '../components/appLoad';
import "@fortawesome/fontawesome-svg-core/styles.css"

const ysabeauO = Ysabeau_Office( {
    subsets: [ 'latin' ],
    display: 'swap',
    adjustFontFallback: false,
    variable: "--custom-font-ysabeau0"
} );


export const metadata = {
    title: 'Ceusia',
    description: 'A place to share',
}

export default async function RootLayout( { children } ) {
    // const session = await getServerSession( authOptions() )
    return (
        <html lang="en">
            <body className={ `${ ysabeauO.variable }` } >
                <Provider>
                    <AppLoad />
                    <AppNav />
                    { children }
                    <Footer />
                </Provider>
            </body>
        </html>
    )
}