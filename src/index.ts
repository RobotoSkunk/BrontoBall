import 'source-map-support/register';
import * as dotenv from 'dotenv';
dotenv.config();


import crypto from 'crypto';

import express from 'express';
import cookieParser from 'cookie-parser';
import httpError, { HttpError } from 'http-errors';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import recursiveRouting from 'recursive-routing';
import * as useragent from 'express-useragent';
import ejs from 'ejs';



const app = express();
const production = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 80;


(async () => {
	app.set('etag', false);
	app.set('views', './views');
	app.set('view engine', 'ejs');
	app.set('x-powered-by', false);
	app.set('case sensitive routing', true);
	app.set('trust proxy', true);

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(morgan('dev'));
	app.use(compression());
	app.use(cors());
	app.use(helmet());
	app.use(useragent.express());


	app.use((req, res, next) => {
		const nonce = crypto.randomBytes(16).toString('base64url');
		res.locals.nonce = nonce;


		res.header('Content-Security-Policy',
			`default-src 'self' 'unsafe-hashes' 'unsafe-inline' ${!production ? 'localhost:*': ''}`
				+ `cdnjs.cloudflare.com api.pwnedpasswords.com js.hcaptcha.com *.hcaptcha.com`

			+ `script-src 'strict-dynamic' 'unsafe-inline' https: 'nonce-${nonce}';`
			+ `base-uri 'self';`
			+ `object-src 'none';`
			+ `img-src 'self' data: *.robotoskunk.com robotoskunk.com cdn.jsdelivr.net;`
		);
		res.header('X-UA-Compatible', 'IE=Edge');
		res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains;');
		res.header('X-Frame-Options', 'sameorigin');
		res.header('X-XSS-Protection', '0; mode=block');
		res.header('X-Content-Type-Options', 'nosniff');
		res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
		res.header('Feature-Policy', "microphone 'none'; geolocation 'none'; camera 'none';");
		res.header('Keep-Alive', 'timeout=5');
		res.header('X-Powered-By', 'Your mom');

		next();
	});

	app.use(express.static('./public', {
		maxAge: production ? '1y' : 0,
		dotfiles: 'ignore',
		fallthrough: true,
		etag: true
	}));


	app.use((req, res, next) => {
		res.header('Cache-Control', 'no-cache');
		next();
	});

	try {
		recursiveRouting(app, {
			keepIndex: true,
			rootDir: './dist/routes',
			filter: (file: string) => file.endsWith('.js')
		});
	} catch (e) {
		console.error(e);
	}


	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`);
	});
})();
