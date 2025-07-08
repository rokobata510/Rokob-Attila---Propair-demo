const { suggestTitle } = require('../services/aiService');

const getTitleSuggestion = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Description is required' });
  }

  try {
    const title = await suggestTitle(description);
    res.json({ title });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('AI service error');
  }
};

module.exports = { getTitleSuggestion };