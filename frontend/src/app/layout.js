import "./globals.css";
import { ysabeauO } from "./font";
import AppNav from "./(components)/global/appNav";
import Search from "./(components)/tools/search";
import Footer from "./(components)/global/footer";
import AuthProvider from "./(components)/AuthProvider";
import ThemesProvider from "./(components)/ThemeProvider";
import AppLoad from "./(components)/appLoad";
import "@fortawesome/fontawesome-svg-core/styles.css";
import RootLayoutClient from "./(components)/motions/layoutClient";
import { ChatContextProvider } from "./(components)/ChatContext";
import ThemeButton from "./(components)/global/themeButton";
import SkipNavigationLink from "./(components)/tools/skipNavigationLink";
import ScrollBottomButton from "./(components)/tools/scrollBottomButton";
import ScrollTopButton from "./(components)/tools/scrollTopButton";

export const metadata = {
	title: "Ceusia",
	description: "A place to share",
};
export const viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 5,
	userScalable: true,
	// Also supported by less commonly used
	// interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={ysabeauO.className}
			suppressHydrationWarning={true}>
			<body id="body-container" suppressHydrationWarning={true}>
				<AuthProvider>
					<ThemesProvider>
						<ChatContextProvider>
							<AppLoad />
							<SkipNavigationLink />
							<ScrollBottomButton />
							<AppNav />
							<ThemeButton />
							<Search />
							<RootLayoutClient>
								<div
									id="main-container"
									tabIndex={-1}
									className="focus:outline-none">
									{children}
								</div>
							</RootLayoutClient>
							<ScrollTopButton />
							<Footer />
						</ChatContextProvider>
					</ThemesProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
