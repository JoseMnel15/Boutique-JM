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

const CATEGORY_MAP = {
    tenis: 'Unisex',
    bolsos: 'Mujer',
    ropaDama: 'Mujer',
    ropaHombre: 'Hombre',
    ropaNina: 'Niña',
    ropaNino: 'Niño',
    accesorios: 'Unisex',
};

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

// Brands
app.get('/brands', authMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, created_at FROM brands ORDER BY name ASC');
        res.json({ brands: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.post('/brands', authMiddleware, async (req, res) => {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
        return res.status(400).json({ message: 'La marca es obligatoria' });
    }
    try {
        const { rows } = await pool.query(
            'INSERT INTO brands (name) VALUES ($1) ON CONFLICT (lower(name)) DO UPDATE SET name = EXCLUDED.name RETURNING id, name, created_at',
            [name.trim()],
        );
        res.status(201).json({ brand: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Products
app.get('/products', authMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT p.id, p.name, p.category, p.sku, p.price, p.stock, p.size, p.color, p.gender, p.created_at,
                    b.id as brand_id, b.name as brand_name
             FROM products p
             JOIN brands b ON b.id = p.brand_id
             ORDER BY p.id DESC`,
        );
        res.json({ products: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.post('/products', authMiddleware, async (req, res) => {
    const { name, brandId, category, sku, price, stock, size, color } = req.body || {};
    if (!name || !brandId || !category || !sku) {
        return res.status(400).json({ message: 'Nombre, marca, categoría y SKU son obligatorios' });
    }
    if (!CATEGORY_MAP[category]) {
        return res.status(400).json({ message: 'Categoría inválida' });
    }
    if (price === undefined || Number(price) <= 0) {
        return res.status(400).json({ message: 'Precio inválido' });
    }
    if (stock === undefined || Number(stock) < 0) {
        return res.status(400).json({ message: 'Inventario inválido' });
    }

    const gender = CATEGORY_MAP[category] || 'Unisex';

    try {
        const { rows } = await pool.query(
            `INSERT INTO products (name, brand_id, category, sku, price, stock, size, color, gender)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, name, category, sku, price, stock, size, color, gender, created_at`,
            [name.trim(), brandId, category, sku.trim(), Number(price), Number(stock), size || null, color || null, gender],
        );
        const product = rows[0];
        const brandRes = await pool.query('SELECT id, name FROM brands WHERE id = $1', [brandId]);
        const brand = brandRes.rows[0];
        return res.status(201).json({ product: { ...product, brand_id: brand.id, brand_name: brand.name } });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'SKU duplicado' });
        }
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Marca no encontrada' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.put('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, brandId, category, sku, price, stock, size, color } = req.body || {};
    if (!name || !brandId || !category || !sku) {
        return res.status(400).json({ message: 'Nombre, marca, categoría y SKU son obligatorios' });
    }
    if (!CATEGORY_MAP[category]) {
        return res.status(400).json({ message: 'Categoría inválida' });
    }
    if (price === undefined || Number(price) <= 0) {
        return res.status(400).json({ message: 'Precio inválido' });
    }
    if (stock === undefined || Number(stock) < 0) {
        return res.status(400).json({ message: 'Inventario inválido' });
    }

    const gender = CATEGORY_MAP[category] || 'Unisex';

    try {
        const { rows } = await pool.query(
            `UPDATE products
             SET name = $1,
                 brand_id = $2,
                 category = $3,
                 sku = $4,
                 price = $5,
                 stock = $6,
                 size = $7,
                 color = $8,
                 gender = $9,
                 created_at = created_at
             WHERE id = $10
             RETURNING id, name, category, sku, price, stock, size, color, gender, created_at`,
            [name.trim(), brandId, category, sku.trim(), Number(price), Number(stock), size || null, color || null, gender, id],
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const brandRes = await pool.query('SELECT id, name FROM brands WHERE id = $1', [brandId]);
        const brand = brandRes.rows[0];
        return res.json({ product: { ...rows[0], brand_id: brand.id, brand_name: brand.name } });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ message: 'SKU duplicado' });
        }
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Marca no encontrada' });
        }
        res.status(500).json({ message: 'Error del servidor' });
    }
});

app.delete('/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        if (!rowCount) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
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
