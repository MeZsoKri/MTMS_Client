const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 4322;
const json = require('jsonify');

const db = new sqlite3.Database('regedit.db', (err) => {
    if (err) {
        console.error('Failed to connect to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

app.use(express.json());

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint
app.get('/api/alive', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

app.get('/api/config', (req, res) => {
    db.all('SELECT * FROM device', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const result = JSON.stringify(rows[0]);
            console.log(result)
            res.send(rows)
        }
    });
});
// POST endpoint
app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({ received: data });
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});


app.get('/api/modificate', (req, res) => {
    const data = req.body;
    const hostname = req.body.hostname
    const db = new sqlite3.Database('regedit.db', (err) => {
        if (err) {
            console.error('Failed to connect to SQLite:', err.message);
        } else {
            console.log('Connected to SQLite database ' + hostname);
        }
    });

    console.log(hostname)
    const updates = [];
    const values = [];
    for (const key in data) {
        if (key !== 'hostname' && data[key] != null) {
            updates.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    const sql = `UPDATE device SET ${updates.join(', ')} WHERE id = 1`;
    db.run(sql, values, function (err) {
        db.close();
        if (err) {
            return res.status(500).json({ error: 'Update failed: ' + err.message });
        } else {
            return res.status(200).json({ status: "Update has been done" })
        }
    });
});