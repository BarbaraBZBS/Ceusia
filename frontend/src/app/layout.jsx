import './globals.css';
import { ysabeauO } from './font';
import AppNav from '../components/appNav';
import Footer from '../components/footer';
import Provider from './Provider';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../pages/api/auth/[...nextauth]';
import AppLoad from '../components/appLoad';
import "@fortawesome/fontawesome-svg-core/styles.css";


export const metadata = {
    title: 'Ceusia',
    description: 'A place to share',
}

export default async function RootLayout( { children } ) {
    // const session = await getServerSession( authOptions() )
    return (
        <html lang="en" className={ ysabeauO.className }>
            <body>
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