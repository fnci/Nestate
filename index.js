import express from "express";
import router from "./routes/routes.js";
import * as dotenv from 'dotenv';

const app = express();
app.use('/auth', router);

// Enable Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Development Variables
dotenv.config({ path: 'var.env' });

// Add port
app.listen(process.env.PORT, () => {
    console.log('listening on port')
});