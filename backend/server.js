import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import localitiesRouter from "./routes/localitiesRoutes.js";

const app = express();
const port = process.env.PORT || 4000
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://keerthiga-house-price-prediction.vercel.app']
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // allows tools like Postman
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('Not allowed by CORS'), false);
      }
      return callback(null, true);
    },
    credentials: true
  }));
  

// API Endpoints
app.get('/', (req, res) => res.send("API is Working"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/house', localitiesRouter);

app.listen(port, () => console.log(`server started on PORT ${port}`))