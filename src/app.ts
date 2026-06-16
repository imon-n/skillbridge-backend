import express, { type Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
 import  cors from "cors";

import tutorRoute from "./modules/tutor/tutor.route";
import categoryRoute from "./modules/category/category.route";
import bookingRoute from "./modules/booking/booking.route";
import reviewRoute from "./modules/review/review.route";
import authRoute from "./modules/auth/auth.route";
import adminRoute from "./modules/admin/admin.route";
import paymentRoute from "./modules/payment/payment.route";


const app: Application = express();



app.use(express.json());

// app.use(cors({
//   origin: process.env.APP_URL ||"https://skillbridge-frontend-ten-nu.vercel.app",
//   credentials: true
// }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://skillbridge-frontend-ten-nu.vercel.app",
    ],
    credentials: true,
  })
);


app.use("/api/auth", toNodeHandler(auth)); 
app.use("/api", authRoute);                 

// other routes
app.use("/api", tutorRoute);
app.use("/api", categoryRoute);
app.use("/api", bookingRoute);
app.use("/api", reviewRoute);
app.use("/api",adminRoute );


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;