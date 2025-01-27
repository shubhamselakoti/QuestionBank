const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')


const app = express();
app.use(cors())

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
    const type = req.query.type || 'ALL';

    let subType = '';
    if (type.includes('ANAGRAM')) {
      subType = type.slice(8);
    }

    const searchQuery = {};

    if (searchTerm) {
      searchQuery.title = { $regex: new RegExp(searchTerm, 'i') };
    }
    if (type !== 'ALL') {
      searchQuery.type = type.includes('ANAGRAM') ? 'ANAGRAM' : type;
    }
    if (type.includes('ANAGRAM') && subType) {
      searchQuery.anagramType = subType;
    }


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
  port = 5000;
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
