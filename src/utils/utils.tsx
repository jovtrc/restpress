import { IMethodArgs, IWpApiRoutes, IWpRoutes } from "../interfaces/IRoutes.ts";

/**
 * Trims specified characters from the start and end of a string.
 * Defaults to trimming whitespace.
 *
 * @param {string} str - The string to be trimmed.
 * @param {string} [charMap='\\s'] - The characters to trim (default is whitespace).
 * @returns {string} - The trimmed string.
 */
export function trim(str: string, charMap: string = '\\s'): string {
    return str.replace(new RegExp(`^[${charMap}]+|[${charMap}]+$`, 'g'), '');
}

/**
 * Returns a readable type string for a given method argument.
 *
 * @param {IMethodArgs} arg - The argument object.
 * @returns {string} - The formatted type string.
 */
export function getTypeString(arg: IMethodArgs): string {
    if (arg.type === 'array') {
        return `${arg.items?.type ?? 'unknown'}[]`;
    }

    if (arg.type === 'string' && arg.enum) {
        return Object.values(arg.enum).join(', ');
    }

    return Array.isArray(arg.type) ? arg.type.join('/') : (arg.type ?? '');
}

/**
 * Converts a WordPress route path to a more readable format.
 * Example: "/wp/v2/posts/(?P<id>\\d+)" -> "/wp/v2/posts/:id"
 *
 * @param {string} path - The route path.
 * @returns {string} - The readable route path.
 */
export function getRouteReadable(path: string): string {
    const readablePath = path.replace(/\(.*?<([a-zA-Z0-9_-]+)>.*?\)/g, ':$1');
    return readablePath.replace('?)[\\/\\w%-]+)', '').replace('\\[\\]\\@_\\-]+)', '').replace('?)', '').replace(')/', '/');
}

/**
 * Generates a clean URL from a route path.
 * Example: "/wp/v2/posts/:id" -> "/wp/v2/posts/id/"
 *
 * @param {string} path - The route path.
 * @returns {string} - The formatted URL.
 */
export function getRouteURL(path: string): string {
    const readablePath = getRouteReadable(path);
    return `${readablePath.replace(/:/g, '')}/`;
}

/**
 * Extracts and organizes routes by namespace.
 *
 * @param {IWpRoutes} routes - The WordPress routes object.
 * @returns {IWpApiRoutes} - The organized routes by namespace.
 */
export function getNamespacedRoutes(routes: IWpRoutes): IWpApiRoutes {
    const namespacedRoutes: IWpApiRoutes = {};

    for (const key in routes) {
        const route = routes[key];
        const namespace = trim(route.namespace, '/');

        // Skip the base namespace route
        if (key === `/${namespace}`) {
            continue;
        }

        const formattedRoute = {
            path: getRouteReadable(key),
            relative: getRouteReadable(key).replace(`/${namespace}`, ''),
            url: getRouteURL(key),
            endpoints: route.endpoints,
        };

        // Initialize namespace array if it doesn't exist
        if (!namespacedRoutes[namespace]) {
            namespacedRoutes[namespace] = [];
        }

        namespacedRoutes[namespace].push(formattedRoute);
    }

    return namespacedRoutes;
}
