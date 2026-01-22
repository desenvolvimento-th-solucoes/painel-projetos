const bcrypt = require ('bcrypt');
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');

// Servir arquivos estáticos (HTML, CSS, JS) da raiz
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'App.tsx'));
});


// Configurações do Banco
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'th_solucoes',
    waitForConnections: true,
    connectionLimit: 10
});

// Helper para converter campos JSON do MySQL em objetos JS
const parseJSON = (rows, ...fields) => rows.map(r => {
    fields.forEach(f => {
        if (r[f] && typeof r[f] === 'string') {
            try { r[f] = JSON.parse(r[f]); } catch (e) { r[f] = []; }
        }
    });
    return r;
});

// --- API ROUTES ---

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? ' [email]);
        const userDB = rows[0];
        const passwordMatch = await bcrypt.compare(
            password,
            userDB.password
        );
        if (rows.length) {
            if (passwordMatch){
                const user = parseJSON(rows, 'accessibleInstitutions')[0];
            res.json(user);
            return;
            }
            res.status(401).json({ error: 'Credenciais inválidas' });
            
        } else {
            res.status(401).json({ error: 'Login ou senha incorretos' });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role, avatar, jobTitle, institution, accessibleInstitutions FROM users');
        res.json(parseJSON(rows, 'accessibleInstitutions'));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users', async (req, res) => {
    try {
        const u = req.body;
        const password = u.password;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);
        await pool.query(
            'INSERT INTO users (id, name, email, password, role, avatar, jobTitle, institution, accessibleInstitutions) VALUES (?,?,?,?,?,?,?,?,?)',
            [u.id, u.name, u.email, hashedPassword, u.role, u.avatar, u.jobTitle, u.institution, JSON.stringify(u.accessibleInstitutions)]
        );
        res.status(201).json(u);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const u = req.body;
        // Se a senha estiver vazia, não atualiza o campo password
        let query = 'UPDATE users SET name=?, email=?, role=?, jobTitle=?, institution=?, accessibleInstitutions=?';
        let params = [u.name, u.email, u.role, u.jobTitle, u.institution, JSON.stringify(u.accessibleInstitutions)];
        
        if (u.password && u.password.trim() !== '') {
            query += ', password=?';
            params.push(u.password);
        }
        
        query += ' WHERE id=?';
        params.push(req.params.id);
        
        await pool.query(query, params);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', async (req, res) => {
    try {
        const { role, institutions } = req.query;
        let query = 'SELECT * FROM projects';
        let params = [];
        if (role !== 'ADMIN' && institutions && institutions !== '[]') {
            const allowed = JSON.parse(institutions);
            query += ' WHERE institution IN (?)';
            params.push(allowed);
        }
        const [rows] = await pool.query(query, params);
        const projects = rows.map(r => ({
            ...r,
            votes: {
                up: r.votes_up,
                down: r.votes_down,
                userVotes: typeof r.user_votes_json === 'string' ? JSON.parse(r.user_votes_json) : (r.user_votes_json || {})
            }
        }));
        res.json(projects);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/projects', async (req, res) => {
    try {
        const p = req.body;
        await pool.query(
            'INSERT INTO projects (id, userId, institution, name, status, progress, startDate, endDate, description, responsibleName, user_votes_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [p.id, p.userId, p.institution, p.name, p.status, p.progress, p.startDate, p.endDate, p.description, p.responsibleName, JSON.stringify(p.votes.userVotes)]
        );
        res.status(201).json(p);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const p = req.body;
        await pool.query(
            'UPDATE projects SET name=?, status=?, progress=?, description=?, institution=?, responsibleName=?, startDate=?, endDate=?, votes_up=?, votes_down=?, user_votes_json=? WHERE id=?',
            [p.name, p.status, p.progress, p.description, p.institution, p.responsibleName, p.startDate, p.endDate, p.votes.up, p.votes.down, JSON.stringify(p.votes.userVotes), req.params.id]
        );
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/institutions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM institutions');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/institutions', async (req, res) => {
    try {
        const i = req.body;
        await pool.query('INSERT INTO institutions (id, name, status) VALUES (?,?,?)', [i.id, i.name, i.status]);
        res.json(i);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/institutions/:id', async (req, res) => {
    try {
        const i = req.body;
        await pool.query('UPDATE institutions SET name=?, status=? WHERE id=?', [i.name, i.status, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/institutions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM institutions WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/groups', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user_groups');
        res.json(parseJSON(rows, 'userIds'));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/groups', async (req, res) => {
    try {
        const g = req.body;
        await pool.query('INSERT INTO user_groups (id, name, description, userIds) VALUES (?,?,?,?)', [g.id, g.name, g.description, JSON.stringify(g.userIds)]);
        res.json(g);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/groups/:id', async (req, res) => {
    try {
        const g = req.body;
        await pool.query('UPDATE user_groups SET name=?, description=?, userIds=? WHERE id=?', [g.name, g.description, JSON.stringify(g.userIds), req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/groups/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM user_groups WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/votes', async (req, res) => {
    try {
        const v = req.body;
        await pool.query(
            'INSERT INTO votes_log (id, userId, userName, userAvatar, itemId, itemName, itemType, voteType, institution, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [v.id, v.userId, v.userName, v.userAvatar, v.itemId, v.itemName, v.itemType, v.voteType, v.institution, v.timestamp]
        );
        const [pRows] = await pool.query('SELECT * FROM projects WHERE id = ?', [v.itemId]);
        if (pRows.length) {
            const project = pRows[0];
            const userVotes = typeof project.user_votes_json === 'string' ? JSON.parse(project.user_votes_json) : (project.user_votes_json || {});
            userVotes[v.userId] = { type: v.voteType, userName: v.userName };
            const up = Object.values(userVotes).filter(uv => uv.type === 'up').length;
            const down = Object.values(userVotes).filter(uv => uv.type === 'down').length;
            await pool.query(
                'UPDATE projects SET votes_up=?, votes_down=?, user_votes_json=? WHERE id=?',
                [up, down, JSON.stringify(userVotes), v.itemId]
            );
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/votes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM votes_log ORDER BY timestamp DESC LIMIT 100');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 TH Soluções Backend Rodando em http://localhost:${PORT}`));
