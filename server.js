const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()


const app = express();

const mongoURI = "mongodb+srv://"+process.env.SECURITY_KEY_USER+":"+process.env.SECURITY_KEY+"@questionbank.xecvk.mongodb.net/questions";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected to speakXque database'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const speakXqueSchema = new mongoose.Schema({
  type: String,
  anagramType: String,
  blocks: [
    {
      text: String,
      showInOption: Boolean,
      isAnswer: Boolean
    }
  ],
  siblingId: mongoose.Schema.Types.ObjectId,
  solution: String,
  title: String,
  options: [
    {
      text: String,
      isCorrectAnswer: Boolean
    }
  ]
});

const SpeakXque = new mongoose.model("SpeakXQue", speakXqueSchema);


app.get('/get', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const searchTerm = req.query.search || '';
  
      const searchQuery = searchTerm
        ? { title: { $regex: new RegExp(searchTerm, 'i') } }
        : {};
  
      const data = await SpeakXque.find(searchQuery)
        .skip(skip)
        .limit(limit);
  
      const totalDocuments = await SpeakXque.countDocuments(searchQuery);
  
      const totalPages = Math.ceil(totalDocuments / limit);
  
      res.status(200).json({
        data,
        totalPages,
        currentPage: page,
        totalDocuments,
        limit,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  
  
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
