export interface ISchema {
    site_name?: string,
    site_home?: string,
    site_icon?: string,
    routes: INamespace[]
}

export interface INamespace {
    namespace: string,
    endpoints: IEndpoint[]
}

export interface IEndpoint {
    path: string;
    relative: string;
    url: string;
    endpoints: IMethod[]
}

export interface IMethod {
    args: {
        [key: string]: IMethodArgs
    },
    methods: []
}

export interface IMethodArgs {
    name?: string;
    description?: string;
    type?: string | string[];
    enum?: string[];
    default?: boolean;
    items?: {
		type?: string
	};
    required?: boolean;
}

export interface IWpRoutes {
    [key: string]: {
        endpoints: [],
        methods: [],
        namespace: string,
    }
}

export interface IWpApiRoutes {
    [key: string]: IEndpoint[]
}
