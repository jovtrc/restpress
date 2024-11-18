import {useEffect, useState} from "react";
import {ISchema} from "../interfaces/IRoutes.ts";
import fetchSchemaData from "../utils/fetch-schema.ts";
import config from "../data/config.ts";
import {useParams} from "react-router-dom";
import EndpointDetails from "../components/Endpoint/EndpointDetails.tsx";
import EndpointSkeleton from "../components/Endpoint/EndpointSkeleton.tsx";

export default function Endpoint() {
	const { '*': endpointPathParam } = useParams();
	const [schema, setSchema] = useState<ISchema | null>(null);
	const allowedNamespaces   = config.namespaces.length > 0 ? config.namespaces.split(",") : [];
	const baseApiUrl          = config.api_base_url.replace(/\/$/, '');

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchSchemaData();
			setSchema(data);
		};

		fetchData();
	}, []);

	if (!schema) {
		return (
			<EndpointSkeleton />
		)
	}

	return (
		<div className="flex-1 flex flex-col divide-y">
			{schema.routes.map((route, routeIndex) => {
				const isNamespaceAllowed = allowedNamespaces.length <= 0 || allowedNamespaces.includes(route.namespace);
				if (!isNamespaceAllowed) {
					return null;
				}

				return route.endpoints?.map((endpointsList, endpointsListIndex) => {
					const endpointPath = endpointsList.path;
					const endpointUrl = endpointsList.url;

					return endpointsList.endpoints.map((endpoint, endpointIndex) => {
						if (endpointUrl !== `/${endpointPathParam}`) {
							return null;
						}

						return (
							<EndpointDetails
								key={`${routeIndex}-${endpointsListIndex}-${endpointIndex}`}
								endpoint={endpoint}
								endpointPath={endpointPath}
								baseApiUrl={baseApiUrl}
							/>
						);
					});
				});
			})}
		</div>
	);
}
