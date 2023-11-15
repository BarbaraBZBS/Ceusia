import "./globals.css";
//import "./output.css";
import { ysabeauO } from "./font";
import AppNav from "../components/global/appNav";
import Search from "@/components/tools/search";
import Footer from "../components/global/footer";
import Provider from "./Provider";
//// import { getServerSession } from 'next-auth';
//// import { authOptions } from '../../pages/api/auth/[...nextauth]';
import AppLoad from "../components/appLoad";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PageWrap } from "../components/motions/pageWrap";
import RootLayoutClient from "@/components/motions/layoutClient";

export const metadata = {
	title: "Ceusia",
	description: "A place to share",
};

export default function RootLayout({ children }) {
	// const session = await getServerSession( authOptions() )
	return (
		<html lang="en" className={ysabeauO.className}>
			<body id="body-container" suppressHydrationWarning={true}>
				<Provider>
					<AppLoad />
					<AppNav />
					<Search />
					<RootLayoutClient>{children}</RootLayoutClient>
					<Footer />
				</Provider>
			</body>
		</html>
	);
}
