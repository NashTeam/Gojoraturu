const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const { spotifydl, fsaver, Mp3, Mp4, tiktok, pinterestDL, getInstagramVideoAndComments } = require('./api/scraper');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use(cors());

app.get('/youtube-mp3', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url YouTube pada parameter url='
        });
    }
    try {
        const result = await Mp3(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/youtube-mp4', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url YouTube pada parameter url='
        });
    }
    try {
        const result = await Mp4(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/instagram', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url Instagram pada parameter url='
        });
    }
    try {
        const result = await getInstagramVideoAndComments(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/pinterest', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url Pinterest pada parameter url='
        });
    }
    try {
        const result = await pinterestDL(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url Tiktok pada parameter url='
        });
    }
    try {
        const result = await tiktok(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/facebook', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url Facebook pada parameter url='
        });
    }
    try {
        const result = await fsaver.download(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.get('/spotify', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            code: 400,
            result: 'masukkan url Spotify pada parameter url='
        });
    }
    try {
        const result = await spotifydl(url);
        res.json({ result });
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            result: error
        });
    }
});

app.listen(PORT, () => {
    console.log(`💡 Server In http://localhost:${PORT}`);
});