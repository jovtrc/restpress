import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/globals.css';

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import Root from "./routes/root.tsx";
import NotFoundPage from "./routes/not-found.tsx";
import Endpoint from "./routes/endpoint.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <NotFoundPage />,
		children: [
			{
				path: "api-docs/*",
				element: <Endpoint />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
