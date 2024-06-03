import { useEffect, useState } from 'react';
import {
    getTypeString,
    getNamespacedRoutes,
    getRouteReadable,
    getRouteURL,
    trim
} from "./utils/utils.tsx"
import Menu from "./components/Menu/Menu.tsx";

function App() {
    const [schema, setSchema] = useState([]);
    const [completeRoutes, setCompleteRoutes] = useState();

    const [routes, setRoutes] = useState({});
    const [routesNames, setRoutesNames] = useState<string[]>([]);

    const [namespaces, setNamespaces] = useState([]);

    useEffect(() => {
        fetch('https://wordpress.org/wp-json/')
            .then((response) => response.json())
            .then((data) => {
                console.log(typeof (data.routes));

                setSchema(data);
                setRoutes(data.routes);
                setNamespaces(data.namespaces);
                setRoutesNames(Object.keys(data.routes));
                setCompleteRoutes(getNamespacedRoutes(data.routes));
            });
    }, []);

    return (
        <div className="flex">
            <div className="flex-none border-e bg-white w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto">
                <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"></span>

                <Menu
                    routes={completeRoutes}
                    namespaces={namespaces}
                />
            </div>

            <div className="flex-1 flex flex-col divide-y">
            {routesNames.length > 0 ? (
                routesNames.map((route, index) => {
                    const routeName = route;
                    const routeDetails = routes[routeName];

                    if (routeDetails.namespace === "wp/v2") {
                        // console.log(routeDetails);
                        // console.log('----------------------');

                    return (
                        <div
                            key={index}
                            id={routeName.replaceAll("/", "_")}
                        >
                            { routeDetails.endpoints.map((endpoint, id) => {
                                const methods = endpoint.methods;
                                const args = endpoint.args;

                                return (
                                    <div
                                        key={id}
                                        className="ounded bg-white p-10"
                                    >
                                        <p className="font-mono font-bold mb-4">
                                            <span className="whitespace-nowrap rounded-full bg-rose-100 px-2 py-0.5 text-sm text-rose-600 mr-2">
                                                [{methods.join( ', ' )}]
                                            </span>
                                            {routeName}
                                        </p>

                                        <div className="overflow-x-auto rounded border border-gray-200 mb-6">
                                            <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                                <tbody className="divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-2 bg-gray-100 w-40 font-semibold">Description</td>
                                                        <td className="px-4 py-2"></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 bg-gray-100 w-40 font-semibold">URL</td>
                                                        <td className="px-4 py-2">https://wordpress.org/wp-json{routeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 bg-gray-100 w-40 font-semibold">Auth</td>
                                                        <td className="px-4 py-2">Bearer Token</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="overflow-x-auto rounded border border-gray-200">
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
                                                    {Object.keys(args).map((arg, index) => {
                                                        arg = { name: arg, ...args[ arg ] }
                                                        return (
                                                            <tr key={index} className="odd:bg-gray-50 hover:bg-gray-100">
                                                                <td className="w-48 px-4 py-2 text-gray-900">
                                                                    {arg.name}
                                                                </td>
                                                                <td className="px-4 py-2 text-gray-700">
                                                                    {arg.description}
                                                                </td>
                                                                <td className="w-96 px-4 py-2 text-gray-700">
                                                                    {arg.enum && `enum:\n\n`}
                                                                    {getTypeString( arg )}
                                                                </td>
                                                                <td className="w-24 px-4 py-2 text-gray-700">
                                                                    {arg.required
                                                                        ? ( <p>true</p> )
                                                                        : ( <p>false</p> )
                                                                    }


                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            } ) }
                        </div>
                    )
                    }

                })
            ) : (
                <div className="w-full h-full flex justify-center items-center text-2xl">
                    Carregando...
                </div>
            )}
            </div>
        </div>
    );
}

export default App;
