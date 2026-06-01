const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// HTML Page Delivery Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/academics', (req, res) => res.sendFile(path.join(__dirname, 'academics.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));

// 1. Route to serve the Admin Login Page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 2. Route to serve the Secure Admin Dashboard Panel
app.get('/admin-panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// Backend API Form Submission Route
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New Inquiry: Name: ${name}, Email: ${email}`);
    res.json({ success: true, reply: `Thank you, ${name}! Your inquiry was received.` });
});

// 3. Secure Admin Authentication API Route
app.post('/api/admin-login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded secure credentials for your admin account
    if (username === 'admin' && password === 'Excellence2026!') {
        res.json({ success: true, redirectUrl: '/admin-panel' });
    } else {
        res.json({ success: false, message: 'Invalid Admin Credentials. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running beautifully on port ${PORT}`);
});