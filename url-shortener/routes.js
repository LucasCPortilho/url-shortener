const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const shortid = require('shortid');
const redis = require('redis');
const client = redis.createClient();

// Conecta ao Redis
client.connect().then(() => console.log("✅ Conectado ao Redis"));

// Encurtar URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL é obrigatória" });

  const shortId = shortid.generate();
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

  try {
    const url = new Url({ originalUrl, shortId });
    await url.save();
    res.json({ shortUrl });
  } catch (err) {
    res.status(500).json({ error: "Erro ao encurtar URL" });
  }
});

// Redirecionar URL (com Redis)
router.get('/:shortId', async (req, res) => {
  try {
    // Verifica no cache
    const cachedUrl = await client.get(req.params.shortId);
    if (cachedUrl) return res.redirect(cachedUrl);

    // Busca no MongoDB
    const url = await Url.findOneAndUpdate(
      { shortId: req.params.shortId },
      { 
        $inc: { clicks: 1 },
        $push: { 
          clickData: { 
            ipAddress: req.ip,
            userAgent: req.get('User-Agent') 
          } 
        }
      }
    );

    if (url) {
      // Salva no Redis (cache de 1h)
      await client.setEx(req.params.shortId, 3600, url.originalUrl);
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: "URL não encontrada" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Analytics (detalhes de cliques)
router.get('/:shortId/stats', async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).json({ error: "URL não encontrada" });

    res.json({
      totalClicks: url.clicks,
      clickData: url.clickData
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;