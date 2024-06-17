import { useEffect, useState } from "react";
import { ISchema } from "../interfaces/IRoutes";
import Menu from "../components/Menu/Menu.tsx";
import fetchSchemaData from "../utils/fetch-schema";
import { Outlet } from "react-router-dom";


export default function Root() {
	const [schema, setSchema] = useState<ISchema | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchSchemaData();
			setSchema(data);
		};

		fetchData();
	}, []);

	if (!schema) {
		return (
			<div className="flex-none border-e bg-white w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto animate-pulse">
				<div className="h-10 w-32 rounded-lg bg-gray-200"></div>
				<span className="mt-6 flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 bg-gray-200 h-9"></span>
			</div>
		)
	}

	return (
		<div className="flex">
			<div className="flex-none border-e bg-white w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto">
				<span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"></span>

				<Menu
					schema={schema}
				/>
			</div>

			<Outlet />
		</div>
	)
}
