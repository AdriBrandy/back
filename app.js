const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas (ejemplo)
app.get('/', (req, res) => {
  res.send('API de Pokémon funcionando');
});

// Acá se importarán tus rutas reales más adelante
app.use('/api/pokemon', require('./routes/pokemonRoutes'));


module.exports = app;
