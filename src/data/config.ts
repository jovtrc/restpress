const config = Object.assign({}, {
	site_base_url: 'https://wordpress.org',
	api_base_url: 'https://wordpress.org/wp-json',
	namespaces: '',
	site_logo: false,
}, (window && window.restpress) || {});

export default config;
