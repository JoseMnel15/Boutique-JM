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

// Users CRUD (simple)
app.get('/users', authMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, username, full_name, role, created_at, updated_at FROM users ORDER BY id');
        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.post('/users', authMiddleware, async (req, res) => {
    const { username, fullName, password, role } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }
    const userRole = role || 'seller';
    try {
        const { rows } = await pool.query(
            `INSERT INTO users (username, full_name, password_hash, role)
             VALUES ($1, $2, crypt($3, gen_salt('bf')), $4)
             RETURNING id, username, full_name, role, created_at, updated_at`,
            [username, fullName || null, password, userRole],
        );
        res.status(201).json({ user: rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.put('/users/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { username, fullName, password, role } = req.body || {};
    if (!username) {
        return res.status(400).json({ message: 'Usuario es obligatorio' });
    }
    try {
        const updates = [];
        const values = [];
        let idx = 1;

        updates.push(`username = $${idx++}`); values.push(username);
        updates.push(`full_name = $${idx++}`); values.push(fullName || null);
        updates.push(`role = $${idx++}`); values.push(role || 'seller');
        if (password) {
            updates.push(`password_hash = crypt($${idx++}, gen_salt('bf'))`);
            values.push(password);
        }
        values.push(id);

        const { rows } = await pool.query(
            `UPDATE users
             SET ${updates.join(', ')}, updated_at = now()
             WHERE id = $${idx}
             RETURNING id, username, full_name, role, created_at, updated_at`,
            values,
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ user: rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.delete('/users/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (!rowCount) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
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
