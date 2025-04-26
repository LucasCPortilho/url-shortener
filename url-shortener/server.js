require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => console.error("❌ Erro no MongoDB:", err));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos (front-end)

// Rotas
app.use('/api/url', require('./routes/url'));

// Rota para o front-end (opcional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));