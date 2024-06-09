// global.d.ts
interface RestpressConfig {
	site_base_url?: string;
	api_base_url?: string;
	namespaces?: string;
	site_logo?: boolean;
}

interface Window {
	restpress?: RestpressConfig;
}
