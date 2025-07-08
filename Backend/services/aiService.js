const axios = require('axios');

const suggestTitle = async (description) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate a maximally concise title for an issue ticket based on the description. Return only the title text without any additional formatting.'
          },
          {
            role: 'user',
            content: `Issue description: ${description}`
          }
        ],
        max_tokens: 20
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI service error:', error.response?.data || error.message);
    return description.substring(0, 50) + '...';
  }
};

module.exports = { suggestTitle };