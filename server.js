const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  const txt = fs.readFileSync(file, 'utf8');
  return txt ? JSON.parse(txt) : [];
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// if products.json missing, create sample
if (!fs.existsSync(PRODUCTS_FILE)) {
  const sample = [
    { "id": 1, "name": "Lipstick", "price": 250, "image": "/img/lipstick.jpg", "desc": "Matte lipstick" },
    { "id": 2, "name": "Facewash", "price": 180, "image": "/img/facewash.jpg", "desc": "Daily facewash" }
  ];
  writeJSON(PRODUCTS_FILE, sample);
}

// Routes
app.get('/ping', (req, res) => res.json({ message: 'pong' }));

app.get('/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  res.json(products);
});

app.post('/order', (req, res) => {
  const order = req.body;
  const orders = readJSON(ORDERS_FILE);
  order.id = Date.now();
  order.createdAt = new Date().toISOString();
  orders.push(order);
  writeJSON(ORDERS_FILE, orders);

  // simple notification: console log (we'll add email later)
  console.log('New order:', order);
  res.json({ message: 'Order received', orderId: order.id });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
