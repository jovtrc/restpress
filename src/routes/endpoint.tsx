import {getTypeString} from "../utils/utils.tsx";
import {useEffect, useState} from "react";
import {IMethod, ISchema} from "../interfaces/IRoutes.ts";
import fetchSchemaData from "../utils/fetch-schema.ts";
import config from "../data/config.ts";
import {useParams} from "react-router-dom";

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
			<div className="rounded bg-white p-10 animate-pulse w-full">
				<div className="h-5 bg-gray-200 rounded mb-4"></div>
				<div className="rounded border border-gray-200 mb-6">
					<table className="w-full divide-y divide-gray-200 bg-white text-sm">
						<tbody>
							{[0, 1, 2].map(item => {
								return (
									<tr key={item}>
										<td className="px-4 py-2 bg-gray-100 w-40">
											<div className="h-5 bg-gray-200 rounded"></div>
										</td>
										<td className="px-4 py-2">
											<div className="h-5 bg-gray-200 rounded w-3/4"></div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<div className="overflow-x-auto overflow-y-hidden rounded border border-gray-200">
					<table className="w-full text-sm">
						<thead className="text-left bg-gray-100">
						<tr>
							{[0, 1, 2, 3].map(item => {
								return (
									<th key={item} className="px-4 py-2">
										<div className="h-5 bg-gray-200 rounded"></div>
									</th>
								)
							})}
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
						<tr className="odd:bg-gray-50 hover:bg-gray-100">
							{[0, 1, 2, 3].map(item => {
								return (
									<td key={item} className="w-48 px-4 py-2 text-gray-900">
										<div className="h-5 bg-gray-200 rounded"></div>
									</td>
								)
							})}
						</tr>
						</tbody>
					</table>
				</div>
			</div>
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
								endpointUrl={endpointUrl}
							/>
						);
					});
				});
			})}
		</div>
	);
}

const EndpointDetails = ({ endpoint, endpointPath, baseApiUrl, endpointUrl }: {endpoint: IMethod, endpointPath: string, baseApiUrl: string, endpointUrl: string}) => (
	<div className="rounded bg-white p-10">
		<p className="font-mono font-bold mb-4">
			<span className="whitespace-nowrap rounded-full bg-rose-100 px-2 py-0.5 text-sm text-rose-600 mr-2">
				[{endpoint.methods.join(', ')}]
			</span>
			{endpointPath}
		</p>

		<div className="overflow-x-auto overflow-y-hidden rounded border border-gray-200 mb-6">
			<table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
				<tbody className="divide-y divide-gray-200">
				<tr>
					<td className="px-4 py-2 bg-gray-100 w-40 font-semibold">Description</td>
					<td className="px-4 py-2"></td>
				</tr>
				<tr>
					<td className="px-4 py-2 bg-gray-100 w-40 font-semibold">URL</td>
					<td className="px-4 py-2">{baseApiUrl}{endpointPath}</td>
				</tr>
				<tr>
					<td className="px-4 py-2 bg-gray-100 w-40 font-semibold">Auth</td>
					<td className="px-4 py-2">Bearer Token</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div className="overflow-x-auto overflow-y-hidden rounded border border-gray-200">
			<table className="w-full divide-y-2 divide-gray-200 bg-white text-sm overflow-y-hidden">
				<thead className="text-left bg-gray-100">
				<tr>
					<th className="px-4 py-2 font-semibold text-gray-900">name</th>
					<th className="px-4 py-2 font-semibold text-gray-900">description</th>
					<th className="px-4 py-2 font-semibold text-gray-900">type</th>
					<th className="px-4 py-2 font-semibold text-gray-900">required</th>
				</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
				{Object.keys(endpoint.args).map((arg, index) => {
					const args = { name: arg, ...endpoint.args[arg] };
					return (
						<tr key={index} className="odd:bg-gray-50 hover:bg-gray-100">
							<td className="w-48 px-4 py-2 text-gray-900">{args.name}</td>
							<td className="px-4 py-2 text-gray-700">{args.description}</td>
							<td className="w-96 px-4 py-2 text-gray-700">
								{args.enum && `enum:\n\n`}
								{getTypeString(args)}
							</td>
							<td className="w-24 px-4 py-2 text-gray-700">
								{args.required ? <p>true</p> : <p>false</p>}
							</td>
						</tr>
					);
				})}
				</tbody>
			</table>
		</div>
	</div>
)
