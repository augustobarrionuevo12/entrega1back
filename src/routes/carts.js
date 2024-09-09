const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/carts.json';

const readCarts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));
const writeCarts = (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

router.post('/', (req, res) => {
  try {
    const carts = readCarts();
    const newCart = {
      id: String(carts.length + 1),
      products: []
    };

    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear carrito' });
  }
});

router.get('/:cid', (req, res) => {
  try {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    
    cart ? res.json(cart.products) : res.status(404).json({ message: 'Carrito no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al leer carrito' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  try {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
      const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
      }

      writeCarts(carts);
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});

module.exports = router;
