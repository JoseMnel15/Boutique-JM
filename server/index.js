const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BoutiqueJM API Running');
});

app.post('/login', (req, res) => {
    const { username, email, password } = req.body || {};
    const userInput = username || email;

    if (!userInput || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const adminUser = process.env.ADMIN_USER || process.env.ADMIN_EMAIL || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'cambia-esta-clave';

    if (userInput !== adminUser || password !== adminPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({ message: 'Login exitoso', token: 'dummy-token' });
});

// Test DB connection
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
