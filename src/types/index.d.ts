export {};


declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			PORT?: string;
		}
	}

	namespace Express {
		interface Locals {
			nonce: string;
			body?: string;
			title?: string;
		}
	}
}
