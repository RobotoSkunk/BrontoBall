"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const recursive_routing_1 = __importDefault(require("recursive-routing"));
const useragent = __importStar(require("express-useragent"));
const app = (0, express_1.default)();
const production = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 80;
(() => __awaiter(void 0, void 0, void 0, function* () {
    app.set('etag', false);
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.set('x-powered-by', false);
    app.set('case sensitive routing', true);
    app.set('trust proxy', true);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(useragent.express());
    app.use((req, res, next) => {
        const nonce = crypto_1.default.randomBytes(16).toString('base64url');
        res.locals.nonce = nonce;
        res.header('Content-Security-Policy', `default-src 'self' 'unsafe-hashes' 'unsafe-inline' ${!production ? 'localhost:*' : ''}`
            + `cdnjs.cloudflare.com api.pwnedpasswords.com js.hcaptcha.com *.hcaptcha.com`
            + `script-src 'strict-dynamic' 'unsafe-inline' https: 'nonce-${nonce}';`
            + `base-uri 'self';`
            + `object-src 'none';`
            + `img-src 'self' data: *.robotoskunk.com robotoskunk.com cdn.jsdelivr.net;`);
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
    app.use(express_1.default.static('./public', {
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
        (0, recursive_routing_1.default)(app, {
            keepIndex: true,
            rootDir: './dist/routes',
            filter: (file) => file.endsWith('.js')
        });
    }
    catch (e) {
        console.error(e);
    }
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}))();
//# sourceMappingURL=index.js.map