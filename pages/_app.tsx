import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.min.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

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
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
}
