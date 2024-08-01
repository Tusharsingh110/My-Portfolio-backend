const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback.routes')
connectToMongo();

const app = express();
const port = process.env.PORT;

app.get('/',(req,res)=> {
    res.send('Hello World')
})
// Middleware setup
app.use(cors())
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(express.json());

app.use('/feedbacks', feedbackRoutes)


app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
})