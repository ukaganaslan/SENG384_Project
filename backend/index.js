const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


app.post('/api/people', async (req, res) => {
    const { full_name, email } = req.body;

   
    if (!full_name || !email) {
        return res.status(400).json({ error: "Ad Soyad ve E-posta zorunludur." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Geçersiz e-posta formatı." });
    }

    try {
        const newPerson = await pool.query(
            "INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *",
            [full_name, email]
        );
        res.status(201).json(newPerson.rows[0]);
    } catch (err) {
       
        if (err.code === '23505') {
            return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });
        }
        console.error(err.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});


app.put('/api/people/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, email } = req.body;
    try {
        await pool.query(
            "UPDATE people SET full_name = $1, email = $2 WHERE id = $3",
            [full_name, email, id]
        );
        res.status(200).json({ message: "Kişi güncellendi" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Güncelleme hatası" });
    }
});


app.delete('/api/people/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM people WHERE id = $1", [id]);
        res.status(200).json({ message: "Kişi silindi" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Silme hatası" });
    }
});


app.get('/api/people', async (req, res) => {
    try {
        const allPeople = await pool.query("SELECT * FROM people ORDER BY id ASC");
        res.status(200).json(allPeople.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});


app.listen(port, () => {
    console.log(`Sunucu ${port} portunda dinleniyor...`);
});