const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb://localhost:27017/login')
connect.then(()=>console.log('connected ...')).catch(()=>console.log('error..'))