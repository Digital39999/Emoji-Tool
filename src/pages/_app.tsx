import { ChakraProvider, ThemeConfig, ThemeOverride, extendTheme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				minH: '100vh',
				h: '100%',
				bg: 'transparent',
			},
		}),
	},
	components: {
		Switch: {
			baseStyle: {
				track: {
					bg: '#f17f7e',
					_checked: {
						bg: '#7bcba7',
					},
				},
			},
		},
	},
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false,
	} as ThemeConfig,
	colors: {
		brand: {
			900: '#1a365d',
			800: '#153e75',
			700: '#2a69ac',
		},
	},
}) as ThemeOverride;

export default function MyApp({ Component, pageProps }: AppProps) {
	const [showChild, setShowChild] = useState(false);

	useEffect(() => {
		setShowChild(true);
	}, []);

	if (!showChild) return null;
	if (typeof window === 'undefined') return <></>;
	else return (
		<ChakraProvider theme={theme}>
			<Head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />

				<meta property='title' content={'Emojis Preview'} />
				<meta property='description' content={'Preview for emojis fetched from Digital\'s API.'} />
				<meta name='keywords' content={'emojis, preview, digital, api, discord, status, bot, utils'} />

				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:site' content={'Emojis Preview'} />
				<meta name='twitter:title' content={'Emojis Preview'} />
				<meta name='twitter:description' content={'Preview for emojis fetched from Digital\'s API.'} />
				<meta name='twitter:image' content={'https://cdn.crni.xyz/r/banner.gif'} />

				<meta property='og:title' content={'Emojis Preview'} />
				<meta property='og:description' content={'Preview for emojis fetched from Digital\'s API.'} />
				<meta property='og:type' content='website' />
				<meta property='og:image' content={'/status.png'} />

				<meta name='theme-color' content={'#5c6ceb'} />
				<link rel='shortcut icon' type='image/x-icon' href={'/status.png'} />
				<title>{'Emojis Preview'}</title>
			</Head>

			{<Component {...pageProps} />}
		</ChakraProvider>
	);
}

