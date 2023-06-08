const cors = require('cors')
const express = require('express')
const app = express()
const PORT = 8181;
const HOST = '0.0.0.0';

app.use(cors({
    origin: '*',
}))

const routes = require('./api/v1/routes/items.route');

app.use(express.json())
app.use(routes)



app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})

module.exports = app;