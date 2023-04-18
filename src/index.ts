import 'source-map-support/register';


import cookieParser from 'cookie-parser';
import httpError, { HttpError } from 'http-errors';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import recursiveRouting from 'recursive-routing';
import * as useragent from 'express-useragent';
import ejs from 'ejs';

import express from 'express';


const app = express();
