import {IMethodArgs, IWpApiRoutes, IWpRoutes} from "../interfaces/IRoutes.ts";

export const trim = (str: string, charMap = '\\s') => str.replace( new RegExp( `^[${charMap}]*(.*?)[${charMap}]*$`, 'g' ), '$1' )

export const getTypeString = (arg: IMethodArgs) => {
    switch(arg.type) {
        case 'array':
            return (arg.items && `${arg.items.type}[]`) || arg.type
        case 'string':
            if (arg.enum) {
				const enumValues = Object.values(arg.enum)
                return (`${enumValues.join(',\n')}`)
            }
            return arg.type;
        default:
			if (typeof arg.type === 'object') {
				return arg.type.join('/')
			}

			return arg.type
    }
}

export const getRouteReadable = (path: string) => path.replace( /\(.*?<([a-zA-Z0-9_-]+)>.*?\)/g, ':$1' )

export const getRouteURL = (path: string) => `${getRouteReadable( path ).replace( /:/g, '' )}/`

export const getNamespacedRoutes = (routes: IWpRoutes) => Object.keys(routes)
    .reduce((namespacedRoutes: IWpApiRoutes, key) => {
        const namespace = trim( routes[key].namespace, '/' )

        if ( key === `/${namespace}` ) {
            return namespacedRoutes
        }

        const route = {
            path: getRouteReadable(key),
            relative: getRouteReadable(key).replace( `/${namespace}`, '' ),
            url: getRouteURL(key),
            endpoints: routes[key].endpoints
        }

        namespacedRoutes[ namespace ] = namespacedRoutes[ namespace ] || []

        namespacedRoutes[ namespace ].push( route )

        return namespacedRoutes
    }, {} )
