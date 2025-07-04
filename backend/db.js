const mongoose = require('mongoose')


async function connectToMongo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/inotebook', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

module.exports = connectToMongo;