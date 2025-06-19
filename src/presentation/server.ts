import cookieParser from 'cookie-parser';
import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';

interface Options {
  port: number;
  routes: Router;
}

const allowedOrigins = [
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin: any | undefined, callback: (err: Error | null, origin?: any) => void) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELET, OPTIONS',
  credentials: true
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }
  /**
   * Starts the server and listens on the specified port.
   * @example
   * const router = Router();
   * router.get('/api', (req, res) => {
   *  res.send('Hello World!');
   * });
   * const server = new Server({ port: 3000, routes: router });
   * server.start();
   * @returns {Promise<void>} A promise that resolves when the server is started.
   * ```
   */

  async start() {
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '100kb' }));
    this.app.use(cors(corsOptions))
    this.app.use(cookieParser());
    this.app.use(hpp()); // Prevent HTTP Parameter Pollution
    this.app.disable('x-powered-by');
    this.app.use(helmet())
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // Limit each IP to 20 requests per windowMs
    })
    this.app.use(limiter);
    // this.app.use(
    //   helmet({
    //     contentSecurityPolicy: {
    //       directives: {
    //         defaultSrc: ["'self'"],
    //         scriptSrc: ["'self'", "'unsafe-inline'"],
    //         styleSrc: ["'self'", "'unsafe-inline'"],
    //         imgSrc: ["'self'", 'data:'],
    //         connectSrc: ["'self'"],
    //         fontSrc: ["'self'"],
    //         objectSrc: ["'none'"],
    //         frameAncestors: ["'none'"],
    //         formAction: ["'self'"],
    //         upgradeInsecureRequests: [],
    //       },
    //     }
    //   }))
    //rutas
    this.app.use(this.routes);

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
