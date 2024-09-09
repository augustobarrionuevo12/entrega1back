const express = require('express');
const app = express();
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/carts');

app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 


app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});
