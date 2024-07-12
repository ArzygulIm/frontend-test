const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'formData.json');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', (req, res) => {
    const newEntry = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Файл не существует, создаем новый массив
                return saveData([newEntry], res);
            } else {
                console.error('Error reading file', err);
                return res.status(500).json({ success: false, message: 'Error reading data' });
            }
        }

        try {
            const entries = JSON.parse(data);
            entries.push(newEntry);
            saveData(entries, res);
        } catch (parseError) {
            console.error('Error parsing JSON', parseError);
            return res.status(500).json({ success: false, message: 'Error parsing data' });
        }
    });
});

function saveData(data, res) {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).json({ success: false, message: 'Error saving data' });
        }

        res.json({ success: true, message: 'Data saved successfully' });
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
