import {ISchema} from "../../interfaces/IRoutes.ts";
import ChevronSvg from "../../assets/img/chevron.svg?url";

export default function Menu({ schema }: { schema: ISchema }) {
    return (
        <ul className="mt-6 space-y-1">
            {schema?.routes.length > 0 && (
                schema.routes.map((route, index) => {
                    return (
                        <li key={index}>
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                >
                                    <span className="text-sm font-medium"> {route.namespace} </span>
                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <img
                                            src={ChevronSvg}
                                            className="h-5 w-5"
                                            alt="Open/Close Menu"
                                        />
                                    </span>
                                </summary>

                                <ul className="mt-2 space-y-1 px-4">
                                    {route.endpoints.map((endpoint) => {
                                        return (
                                            <li key={endpoint.path}>
                                                <a
                                                    href={endpoint.url}
                                                    className="overflow-hidden block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                                >
                                                    {endpoint.relative}
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
    )
}