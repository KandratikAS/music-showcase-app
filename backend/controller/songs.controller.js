const { generateSongs } = require('../generator/song.generator');

exports.getSongs = (req, res) => {
  try {
    const seed = req.query.seed || "1";
    const lang = req.query.lang || "en-US";
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const avgLikes = parseFloat(req.query.likes) || 0;

    const data = generateSongs({
      seed,
      lang,
      page,
      pageSize,
      avgLikes
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
