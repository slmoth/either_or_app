const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Middleware
app.use(bodyParser.json(), cors({origin: 'http://localhost:4200'}), express.json());

// File path for storing votes
const votesFilePath = 'votes.json';

// Function to read votes from the JSON file
const readVotes = () => {
    if (!fs.existsSync(votesFilePath)) {
        // Initialize with default values if the file doesn't exist
        writeVotes({ either: 0, or: 0 });
    }
    const data = fs.readFileSync(votesFilePath);
    return JSON.parse(data);
};

// Function to write votes to the JSON file
const writeVotes = (votes) => {
    fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2));
};

// Get vote counts
app.get('/votes', (req, res) => {
    const votes = readVotes();
    res.json(votes);
});

// Post a new vote
app.post('/votes', (req, res) => {
    const { vote } = req.body;

    const votes = readVotes();
    if (vote === 'either') {
        votes.either++;
    } else if (vote === 'or') {
        votes.or++;
    } else {
        return res.status(400).json({ error: 'Invalid option' });
    }

    writeVotes(votes);
    res.status(200).json(votes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
