import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.MARTIAN_API_KEY;
  const { message, willingnessToPay, maxCost, chatHistory } = req.body;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };

  const data = {
    model: "router",
    willingness_to_pay: willingnessToPay,
    // messages: [
    //   {
    //     "role": "user",
    //     "content": message
    //   }
    // ],
    messages: chatHistory.concat([
        {
          "role": "user",
          "content": message
        }
    ]),
    temperature: 1
  };

  if (maxCost !== 0.0) {
    data.max_cost = maxCost;
  }

  try {
    const response = await axios.post('https://withmartian.com/api/openai/v1/chat/completions', data, config);
    console.log(response.data);
    res.status(200).json(response.data.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(500).json({ message: 'No response from server' });
    } else {
      res.status(500).json({ message: 'An error occurred' });
    }
  }
}
