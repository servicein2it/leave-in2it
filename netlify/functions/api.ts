import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CORS for Netlify
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging for serverless
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }
    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }
    console.log(logLine);
  });

  next();
});

// Initialize routes
let routesInitialized = false;

const initializeRoutes = async () => {
  if (!routesInitialized) {
    try {
      await registerRoutes(app);
      routesInitialized = true;
      console.log('Routes initialized successfully');
    } catch (error) {
      console.error('Failed to initialize routes:', error);
      throw error;
    }
  }
};

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('API Error:', err);
  res.status(status).json({ message });
});

// Create serverless handler
const createHandler = async () => {
  await initializeRoutes();
  return serverless(app);
};

// Export for Netlify Functions
export const handler = async (event: any, context: any) => {
  try {
    const serverlessHandler = await createHandler();
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};