const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const http = require('http');
const db_connection = require('./config/db')
const routes = require('./routes/router')
const Products = require('./models/Products');
const Category = require('./models/Category');
const Role = require('./models/Role');
const User = require('./models/User');
const Associations = require('./models/Associations');


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Routes
app.use('/winkbuy', routes);

// Testing API
app.get('/', (req, res) => {
    res.json({ message: 'server is up and running AND api is working perfectly' });
});

// Database connection
db_connection.sync().then(() => {
    console.log('database is synced and running fine');
});

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});