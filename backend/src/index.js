console.log('Starting application...');
try {
    require('dotenv').config();
    console.log('Environment loaded.');
} catch (e) {
    console.error('Error loading dotenv:', e);
}

const express = require('express');
console.log('Express loaded.');
const cors = require('cors');
console.log('Cors loaded.');

console.log('Loading routes...');
const apiRoutes = require('./routes/api');
console.log('Routes loaded.');

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('AmhaChat Backend is running!');
});

// API Routes
app.use('/api', apiRoutes);
const port = parseInt(process.env.PORT) || 8080;
console.log(`Attempting to listen on port ${port} (type: ${typeof port})`);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server successfully started and listening on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
