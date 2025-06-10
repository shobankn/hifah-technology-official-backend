require('dotenv').config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const DataBaseConnection = require('./config/dbCon');
const path = require('path');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/error');
const sliderimagerouter = require('./src/routes/sliderimage');
const contactRouter = require('./src/routes/contactUsroute');




// Create Express app
const app = express();

// Load env vars
// dotenv.config({ path: '.env' });

// DataBaseConnection();

// Body parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}



// Enable CORS
app.use(cors({ origin: '*' }));


// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

app.use('/api',sliderimagerouter);
app.use('/api',contactRouter);







// Welcome API
app.use('/api/test', (req, res) => {
    res.send("Welcome to Hifah Technology");
});



// Error handling middleware at the end
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

// Error Handling Middleware (MUST be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// sometihng is happening