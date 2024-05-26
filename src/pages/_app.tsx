import type { AppProps } from 'next/app';
import { Inter } from "next/font/google";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx global>{`
                body { font-family: ${inter.style.fontFamily}; }
            `}</style>
            <Component {...pageProps} />
        </>
    );
}