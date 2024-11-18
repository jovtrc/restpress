export default function PageSkeleton() {
    return (
        <div className="flex-none border-e bg-white w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto animate-pulse">
            <div className="h-10 w-32 rounded-lg bg-gray-200"></div>
            <span
                className="mt-6 flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 bg-gray-200 h-9"></span>
        </div>
    )
}
