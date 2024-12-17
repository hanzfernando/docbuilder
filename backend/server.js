import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import logger from './middleware/logger.js'
import connectDB from './config/database.js'
// import { createSuperAdminUser } from './models/userModel.js'
import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config()

const PORT = process.env.PORT
const app = express()

app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(logger)
app.use(cors({
    origin: 'http://localhost:7000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);

connectDB()
    .then(async () => {
        // await createSuperAdminUser()
        app.listen(PORT, () => {
            console.log("Server running on port", PORT)
        })
    })
    .catch((error) => {
        console.log("Error: ", error.message);
        process.exit(1)
    })

