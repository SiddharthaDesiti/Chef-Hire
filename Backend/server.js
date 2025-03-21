import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudNiary from './config/cloudinary.js';
import adminRouter from './routes/AdminRoutes.js';
import cookRouter from './routes/CookRoutes.js';
import userRouter from './routes/UserRoutes.js';

const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudNiary();

//middlewares
app.use(express.json());
app.use(cors());

//api end points

app.use('/api/admin', adminRouter);
app.use('/api/cook',cookRouter);
app.use('/api/user',userRouter);


app.get('/', (req, res) => {
    res.send('API WORKING');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
