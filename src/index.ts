import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

app.listen(process.env.PORT,() => {
    console.log(`Auth Service is running on http://localhost:${process.env.PORT}`);
});