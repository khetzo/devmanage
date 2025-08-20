import express from 'express';
import cors from 'cors';                     // CORS middleware to allow cross-origin requests.
import dotenv from 'dotenv';                 // Loads environment variables from .env file.
//import employeesRoutes from './routes/employees'; // Imports employee-related routes.

dotenv.config();                             // Loads environment variables into process.env.

const PORT = process.env.PORT || 5000;

const app = express();                       // Creates an Express application instance.

app.use(cors());                             // Enables CORS for all incoming requests.
app.use(express.json());                     // Parses incoming JSON requests automatically.

// Employee API routes
//app.use('/api/employees', employeesRoutes);  // Mounts employee routes at /api/employees

app.get('/health', (req, res) => {           // Health check endpoint.
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});