import {IMethod} from "../../interfaces/IRoutes.ts";
import {getTypeString} from "../../utils/utils.tsx";

interface IEndpointDetails {
    endpoint: IMethod,
    endpointPath: string,
    baseApiUrl: string
}

export default function EndpointDetails ({ endpoint, endpointPath, baseApiUrl }: IEndpointDetails) {
    return (
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
}
