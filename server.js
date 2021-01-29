require('./config')

const { router } = require('./routes/index')
const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(router)

const port = process.env.PORT

app.use((err, req, res, next) => {
    // set response structure for invalid JSON passed into the API
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const error = {
            message: "Invalid JSON payload passed.",
            status: "error",
            data: null
        }
        return res.status(400).send(error)
    }
    
    res.status(err.statusCode).send({ message: err.message, status: err.status, data: err.data })
})

app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});