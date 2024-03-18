"use client";
import { ThemeProvider } from "next-themes";

export default function ThemesProvider({ children }) {
	return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
