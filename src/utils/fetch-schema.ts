import {ISchema} from "../interfaces/IRoutes";
import config from "../data/config";
import {getNamespacedRoutes} from "./utils";

export default async function fetchSchemaData(): Promise<ISchema> {
	const baseApiUrl = config.api_base_url.replace(/\/$/, '');
	const response = await fetch(baseApiUrl);
	const data = await response.json();

	const namespaces = data.namespaces.map((namespace: string) => ({
		namespace,
		endpoints: getNamespacedRoutes(data.routes)[namespace]
	}));

	return {
		site_name: data.name,
		site_home: data.home,
		site_icon: data.site_icon_url,
		site_logo: data.site_logo,
		routes: namespaces
	};
}
