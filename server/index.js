const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const pool = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('BoutiqueJM API Running');
});

const signToken = (user) => jwt.sign({
    sub: user.id,
    username: user.username,
    role: user.role,
    fullName: user.full_name,
}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

app.post('/login', async (req, res) => {
    const { username, email, password } = req.body || {};
    const userInput = username || email;

    if (!userInput || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    try {
        const { rows } = await pool.query(
            `SELECT id, username, full_name, role, password_hash,
                    password_hash = crypt($2, password_hash) AS valid
             FROM users
             WHERE lower(username) = lower($1)
             LIMIT 1`,
            [userInput, password],
        );

        if (!rows.length || !rows[0].valid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = rows[0];
        const token = signToken(user);

        return res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.full_name,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

app.get('/me', authMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, username, full_name, role FROM users WHERE id = $1',
            [req.user.sub],
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json({ user: rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
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
