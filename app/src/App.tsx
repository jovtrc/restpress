import { useEffect, useState } from 'react';


function App() {
    const [schema, setSchema] = useState([]);
    const [completeRoutes, setCompleteRoutes] = useState();

    const [routes, setRoutes] = useState({});
    const [routesNames, setRoutesNames] = useState([]);

    const [namespaces, setNamespaces] = useState([]);
    const trim = ( str, charmap = '\\s' ) => str.replace( new RegExp( `^[${charmap}]*(.*?)[${charmap}]*$`, 'g' ), '$1' )

    const getTypeString = (arg) => {
        switch(arg.type) {
            case 'array':
                return (arg.items && `${arg.items.type}[]`) || arg.type
            case 'string':
                if (arg.enum) {
                    if (typeof arg.enum === 'object') {
                        arg.enum = Object.keys(arg.enum)
                            .sort((a, b) => a - b)
                            .map(key => arg.enum[key]);
                    }
                    return (`${arg.enum.join(',\n')}`)
                }
                return arg.type;
            default:
                return arg.type
        }
    }

    const getRouteReadable = path => path.replace( /\(.*?<([a-zA-Z0-9_-]+)>.*?\)/g, ':$1' )

    const getRouteURL = path => `${getRouteReadable( path ).replace( /:/g, '' )}/`

    const getNamespacedRoutes = (routes) => Object.keys( routes )
        .reduce( ( namespacedRoutes, key ) => {
            let namespace = trim( routes[key].namespace, '/' )

            if ( key === `/${namespace}` ) {
                return namespacedRoutes
            }

            let route = {
                path: getRouteReadable(key),
                relative: getRouteReadable(key).replace( `/${namespace}`, '' ),
                url: getRouteURL(key)
            }

            namespacedRoutes[ namespace ] = namespacedRoutes[ namespace ] || []

            namespacedRoutes[ namespace ].push( route )

            return namespacedRoutes
        }, {} )

     const getRoutesByNamespace = (schema, namespace) => getNamespacedRoutes(schema)[namespace]

    useEffect(() => {
        fetch('https://wordpress.org/wp-json/')
            .then((response) => response.json())
            .then((data) => {
                const routes = data.routes;
                const routesNames = Object.keys(data.routes);

                routesNames.map(name => {
                    setRoutes({
                        ...routes[name]
                    })
                })

                setSchema(data);
                setCompleteRoutes(getNamespacedRoutes(data.routes))

                setRoutes(routes);
                setRoutesNames(routesNames);
                setNamespaces(data.namespaces);
            });
    }, []);

    return (
        <div className="flex">
            <div className="flex flex-none min-h-screen flex-col justify-between border-e bg-white w-80 sticky top-0">
                <div className="px-4 py-6">
                    <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"></span>

                    <ul className="mt-6 space-y-1">
                        {namespaces.length > 0 && (
                            namespaces.map((namespace, index) => {
                                // console.log(completeRoutes[namespace]);
                                // {console.log(completeRoutes)}

                                return (
                                    <li key={index}>
                                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                                            <summary
                                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                            >
                                                <span className="text-sm font-medium"> {namespace} </span>
                                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </summary>

                                            <ul className="mt-2 space-y-1 px-4">
                                                {completeRoutes[namespace].map((route, index) => {
                                                    return (
                                                        <li  key={route.path}>
                                                            <a
                                                                href="#"
                                                                className="overflow-hidden block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                            >
                                                            {route.relative}
                                                            </a>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </details>
                                    </li>
                                )
                            })
                        )}
                    </ul>
                </div>
            </div>

            <div className="flex-1">
            {routesNames.length > 0 ? (
                routesNames.map((route, index) => {
                    const routeName = route;
                    const routeDetails = routes[routeName];

                    if (routeDetails.namespace === "wp/v2") {
                        console.log(routeDetails);
                        // console.log('----------------------');

                    return (
                        <div
                            key={index}
                            className="flex flex-col divide-y"
                        >
                            { routeDetails.endpoints.map((endpoint, id) => {
                                const methods = endpoint.methods;
                                const args = endpoint.args;

                                return (
                                    <div key={id} className="ounded bg-white p-10">
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
                                            <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
