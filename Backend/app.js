import express from "express"

import morgan from "morgan";

import cookieParser from "cookie-parser";

const app = express();

import dotenv from 'dotenv';
dotenv.config();



import connection from './config/db.js';

connection();

import userRoute from './routes/user.route.js';


import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";

app.use(
  cors({
    origin: "https://codemate-qzju.onrender.com", // your frontend URL
    credentials: true,
  })
);




app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'))

app.use(cookieParser());    

app.use('/api/user',userRoute);



app.use("/api/ai", aiRoutes);




app.get('/',(req,res)=>{
    res.send("Hello World");
})



export default app;