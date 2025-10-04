const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const logger = require("./utils/logger");

const app = express();
const PORT = 3000;

// ==================== USER SERVICE INSTANCES ====================
const userServiceInstances = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003'
];
let currentUserIndex = 0;

// ==================== PAGE SERVICE INSTANCES ====================
const pageServiceInstances = [
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006'
];
let currentPageIndex = 0;

// ==================== RATE LIMIT ====================
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 200,
  message: 'Too many requests, try again later.'
});

// ==================== CONCURRENCY CONTROL ====================
const MAX_CONCURRENT_REQUESTS = 200;
let currentRequests = 0;
const requestQueue = [];

// ==================== ROUND ROBIN HELPERS ====================
function getNextUserService() {
  const target = userServiceInstances[currentUserIndex];
  currentUserIndex = (currentUserIndex + 1) % userServiceInstances.length;
  return target;
}

function getNextPageService() {
  const target = pageServiceInstances[currentPageIndex];
  currentPageIndex = (currentPageIndex + 1) % pageServiceInstances.length;
  return target;
}

// ==================== QUEUE PROCESSOR ====================
function processNext() {
  if (requestQueue.length === 0 || currentRequests >= MAX_CONCURRENT_REQUESTS) return;

  const { req, res, next, serviceType } = requestQueue.shift();
  currentRequests++;

  const target = serviceType === "users" ? getNextUserService() : getNextPageService();

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/${serviceType}`]: `/${serviceType}` },
    onProxyReq(proxyReq, req) {
      logger.info(`[Proxy] ${req.method} ${req.originalUrl} -> ${target}`);
    },
    onProxyRes(proxyRes, req, res) {
      proxyRes.on('end', () => {
        currentRequests--;
        processNext();
      });
    },
    onError(err, req, res) {
      logger.error(`[Proxy Error] ${err.message} - ${req.method} ${req.originalUrl}`);
      currentRequests--;
      res.status(502).json({ error: 'Bad Gateway' });
      processNext();
    }
  });

  proxy(req, res, next);
}

// ==================== LOGGING ====================
app.use((req, res, next) => {
  logger.info(`[Request Received] ${req.method} ${req.originalUrl}`);
  next();
});

// ==================== ROUTES ====================
app.use('/users', limiter, (req, res, next) => {
  requestQueue.push({ req, res, next, serviceType: "users" });
  processNext();
});

app.use('/pages', limiter, (req, res, next) => {
  requestQueue.push({ req, res, next, serviceType: "pages" });
  processNext();
});

app.get('/health', (req, res) => {
  logger.info("[Health Check] API Gateway is running");
  res.json({ status: 'API Gateway running.' });
});

// ==================== START ====================
logger.info("======== API GATEWAY STARTING ========");
app.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT}`);
  logger.info("====================================");
});
