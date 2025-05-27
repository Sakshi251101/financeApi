const Progress = require('../model/progressModel');

// Save or update user progress
async function saveProgress(req, res) {
  const { userId, currentCard, stepInCard, completedCards } = req.body;

  try {
    const parsedCompleted = Array.isArray(completedCards)
      ? completedCards
      : JSON.parse(completedCards || '[]'); // safely parse string input
    const [progress, created] = await Progress.findOrCreate({
      where: { user_id: userId },
      defaults: {
        current_card: currentCard,
        step_in_card: stepInCard,
        completed_cards: parsedCompleted,
      },
    });

    if (!created) {
      // Update existing record
      await progress.update({
        current_card: currentCard,
        step_in_card: stepInCard,
        completed_cards: parsedCompleted,
      });
    }

    res.json({ message: 'Progress saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving progress' });
  }
}

// Get user progress
async function getProgress(req, res) {
  const { userId } = req.params;

  try {
    const progress = await Progress.findOne({ where: { user_id: userId } });
    if (progress) {
      res.json(progress);
    } else {
      res.status(404).json({ message: 'No progress found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching progress' });
  }
}

module.exports = {
  saveProgress,
  getProgress,
};
