import "./globals.css";
//import "./output.css";
import { ysabeauO } from "./font";
import AppNav from "./(components)/global/appNav";
import Search from "./(components)/tools/search";
import Footer from "./(components)/global/footer";
import AuthProvider from "./(components)/AuthProvider";
import AppLoad from "./(components)/appLoad";
import "@fortawesome/fontawesome-svg-core/styles.css";
import RootLayoutClient from "./(components)/motions/layoutClient";

export const metadata = {
	title: "Ceusia",
	description: "A place to share",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={ysabeauO.className}>
			<AuthProvider>
				<body id="body-container" suppressHydrationWarning={true}>
					<AppLoad />
					<AppNav />
					<Search />
					<RootLayoutClient>{children}</RootLayoutClient>
					<Footer />
				</body>
			</AuthProvider>
		</html>
	);
}
