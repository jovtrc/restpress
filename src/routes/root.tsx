import { useEffect, useState } from "react";
import { ISchema } from "../interfaces/IRoutes";
import Menu from "../components/Menu/Menu.tsx";
import fetchSchemaData from "../utils/fetch-schema";
import { Outlet } from "react-router-dom";
import config from "../data/config.ts";
import PageSkeleton from "../components/PageSkeleton.tsx";


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
            <PageSkeleton />
		)
	}

	return (
		<div className="flex">
			<div className="flex-none border-e bg-white w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto">
				<span className="flex items-center text-gray-600 px-4 font-bold gap-2 cursor-default">
					<img className="size-8 rounded" src={config.site_icon} alt="API Docs"/>
					API Docs
				</span>

				<Menu
					schema={schema}
				/>
			</div>

			<Outlet />
		</div>
	)
}
