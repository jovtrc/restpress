export const trim = ( str, charmap = '\\s' ) => str.replace( new RegExp( `^[${charmap}]*(.*?)[${charmap}]*$`, 'g' ), '$1' )

export const getTypeString = (arg) => {
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

export const getRouteReadable = path => path.replace( /\(.*?<([a-zA-Z0-9_-]+)>.*?\)/g, ':$1' )

export const getRouteURL = path => `${getRouteReadable( path ).replace( /:/g, '' )}/`

export const getNamespacedRoutes = (routes: object[]) => Object.keys( routes )
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