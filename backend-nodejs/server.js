const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Định tuyến API
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});