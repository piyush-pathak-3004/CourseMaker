import express from 'express';
import bodyParser from 'body-parser';
import courseRoutes from './routes/course.js';
import unauthenticatedRoutes from './routes/unauthenticatedRoutes.js';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/CourseMakerDB.js';
console.log(process.env.COHERE_API_KEY);

const authConfig = {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
};

// Connect to MongoDB
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log("after bodyParser");

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
});

console.log("after jwtCheck");
app.use(
  jwtCheck.unless({
    path: [
      // public routes that don't require authentication
      /^\/api\/v2\/.*/
    ]
  })
);

console.log("before routes");
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v2/courses', unauthenticatedRoutes);
app.use('/api/v2/lessons', unauthenticatedRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});