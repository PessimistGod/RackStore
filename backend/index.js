const express = require('express');
require('dotenv').config();
const connectDB = require('./Middleware/DB');
const port = process.env.PORT || 6000;
const cors = require('cors');
const authenticate = require('./Routes/AuthApi');
const cartList = require('./Routes/CartApi')
const product = require('./Routes/ProductApi')
const orders = require('./Routes/Orders')


const app = express();
app.use(express.json());


const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

connectDB();

app.get('/', (req, res) => {
    res.json("Rack Api");
  });

app.use('/api/auth', authenticate);
app.use('/api/prod', product);
app.use('/api/cart', cartList);
app.use('/api/orders', orders);




app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
  });