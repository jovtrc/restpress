export default function EndpointSkeleton() {
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
