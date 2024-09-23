const express = require('express'); 
const { create } = require('express-handlebars');
const path = require('path');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const { Server } = require('socket.io');
const fs = require('fs');

// Inicializar Express
const app = express();

// Configurar Handlebars como motor de plantillas
const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main',
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Cambiado para apuntar a la nueva ubicación

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para la vista home (productos)
app.get('/', (req, res) => {
  const products = require('./data/products.json');
  res.render('home', { products });
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// Servidor de Express
const server = app.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});

// Inicializar Socket.io
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Enviar lista de productos cuando el cliente se conecta
  socket.emit('productList', require('./data/products.json'));

  socket.on('newProduct', (newProduct) => {
    const products = require('./data/products.json');
    products.push(newProduct);

    // Actualizar el archivo de productos
    fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));

    // Enviar la lista actualizada de productos a todos los clientes conectados
    io.emit('productList', products);
  });

  socket.on('deleteProduct', (productId) => {
    let products = require('./data/products.json');
    products = products.filter(p => p.id !== productId);

    // Actualizar el archivo de productos
    fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));

    // Enviar la lista actualizada de productos a todos los clientes conectados
    io.emit('productList', products);
  });
});
