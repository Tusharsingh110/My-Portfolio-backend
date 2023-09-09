const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
connectToMongo();

const app = express();
const port = 3000;

app.get('/',(req,res)=> {
    res.send('Hello World')
})
app.use(cors())
app.use(express.json());

app.use('/api/createFeedback', require('./routes/Testing'))
app.use('/api/readFeedbacks', require('./routes/Receiving'))


app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
})