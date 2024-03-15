import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	return (
		<>
			<SessionProvider session={pageProps?.session}>
	
				<DefaultSeo
					title="Ivor Project"
					description="Welcome to Ivor Project"
					canonical={router.pathname}
					openGraph={{
						title: "Ivor Project",
						description: "Welcome to Ivor Project!",
						url: router.pathname || process.env.NEXT_PUBLIC_PUBLIC_URL,
						locale: router.locale || "en",
						site_name: "Ivor Project",
					}}
				/>
				<Toaster />
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}
