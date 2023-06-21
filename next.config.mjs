import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

/** @type { import('next').NextConfig } */
export default {
	'reactStrictMode': true,
	'images': {
		'domains': ['*'],
	},
	async headers() {
		return [{
			'source': '/(.*)',
			'headers': [{
				'key': 'Cache-Control',
				'value': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600', // 1 hour
			}],
		}];
	},
};
