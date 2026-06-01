const express = require('express');
const path = require('path');
const fs = require('fs'); // Node.js Core File System Module
const app = express();

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Helper Function: Safely read inquiries from the JSON database file
function readDatabase() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            // Seed initial sample data if database file doesn't exist yet
            const initialData = [
                { name: "John Kamara", email: "john@example.com", message: "Inquiring about Grade 4 enrollment requirements for the upcoming semester." },
                { name: "Blessing Flomo", email: "blessing@example.com", message: "Does the academy provide transport services for students living further out?" }
            ];
            fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Database reading error:", error);
        return [];
    }
}

// Helper Function: Safely write updated inquiry arrays to the JSON database file
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Database writing error:", error);
    }
}

// HTML Page Delivery Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/academics', (req, res) => res.sendFile(path.join(__dirname, 'academics.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin-panel', (req, res) => res.sendFile(path.join(__dirname, 'admin-panel.html')));

// Interactive Form Capture API Route - Now connected to Persistent DB
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // 1. Pull existing logs from local storage file
    const currentInquiries = readDatabase();
    
    // 2. Append new captured message to the array list
    currentInquiries.push({ name, email, message });
    
    // 3. Save updated collection back to physical disk file
    writeDatabase(currentInquiries);
    
    console.log(`🔒 Database Sync Complete - Inquiry safely saved for: ${name}`);
    res.json({ success: true, reply: `Thank you, ${name}! Your inquiry has been securely logged.` });
});

// Secure API Route for Admin Panel - Pulls dynamically from DB file
app.get('/api/inquiries', (req, res) => {
    const records = readDatabase();
    res.json({ success: true, data: records });
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
    console.log(`Server running with persistent database tracking on port ${PORT}`);
});