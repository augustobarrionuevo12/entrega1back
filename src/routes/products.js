const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/products.json';

const readProducts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
  try {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
  } catch (error) {
    res.status(500).json({ message: 'Error al leer productos' });
  }
});

router.get('/:pid', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    product ? res.json(product) : res.status(404).json({ message: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al leer el producto' });
  }
});

router.post('/', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = { 
      id: String(products.length + 1), 
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status !== undefined ? req.body.status : true,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails || []
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto' });
  }
});
 
router.put('/:pid', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);

    if (index !== -1) {
      const updatedProduct = { ...products[index], ...req.body };
      products[index] = updatedProduct;
      writeProducts(products);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

router.delete('/:pid', (req, res) => {
  try {
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (newProducts.length !== products.length) {
      writeProducts(newProducts);
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

module.exports = router;
