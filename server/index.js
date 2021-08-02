const express = require('express')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require("method-override");
const logger = require('morgan')
const flash = require('express-flash')
const mainRoutes = require('./routes/mainRoutes')
const postRoutes = require('./routes/postRoutes')

require('dotenv').config({path: './config/.env'})

require("./config/passport")(passport);

// connect to mongo DB
const connectDB = require('./config/database')
const clientPromise = connectDB()
                      .then(conn => conn.connection.getClient())


const app = express()

// app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ clientPromise }),
    })
  );
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Use forms for put / delete
app.use(methodOverride("_method"));

app.use(flash())
app.use('/', mainRoutes)
app.use('/post', postRoutes);

app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!', `It's running on ${process.env.PORT}`)
}) 