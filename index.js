import express from "express";
import router from "./routes/routes.js";
import db from "./config/db.js";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import session from 'express-session';


const app = express();


// Read form
app.use(express.urlencoded({extended: true}));

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // By default, the httpOnly attribute is set.
        httpOnly: true,
        // The expires option should not be set directly; instead only use the maxAge option
        //  If both expires and maxAge are set in the options, then the last one defined in the object is what is used.
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // Force the session identifier cookie to be set on every response.
        /* rolling: true, */
        /* secure: true, */
    }
}
app.use(session(sessionConfig));


// Connection to the database
try {
    await db.authenticate();
    db.sync();
    console.log('db connected');
} catch (error) {
    console.log(error);
}


// Enable Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Public folder
app.use(express.static('public'))

// Routing
app.use('/auth', router);

// Development Variables
dotenv.config({ path: '.env' });

// Add port
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('listening on port')
});
