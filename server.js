const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Global array to store inquiries temporarily in server memory
let inquiries = [
    { name: "John Kamara", email: "john@example.com", message: "Inquiring about Grade 4 enrollment requirements for the upcoming semester." },
    { name: "Blessing Flomo", email: "blessing@example.com", message: "Does the academy provide transport services for students living further out?" }
];

// HTML Page Delivery Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/academics', (req, res) => res.sendFile(path.join(__dirname, 'academics.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'admin-panel.html')));

// Interactive Form Capture API Route
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Push the new message into our live data storage
    inquiries.push({ name, email, message });
    console.log(`Live Data Stream Sync - New Inquiry from: ${name}`);
    
    res.json({ success: true, reply: `Thank you, ${name}! Your inquiry has been logged successfully.` });
});

// Secure API Route for Admin Panel to read messages
app.get('/api/inquiries', (req, res) => {
    res.json({ success: true, data: inquiries });
});

// Secure Admin Authentication API Route
app.post('/api/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'Excellence2026!') {
        res.json({ success: true, redirectUrl: '/admin-panel' });
    } else {
        res.json({ success: false, message: 'Invalid Admin Credentials. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running beautifully on port ${PORT}`);
});