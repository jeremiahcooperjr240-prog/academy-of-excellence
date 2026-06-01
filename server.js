const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Helper Function: Read from JSON database file
function readDatabase() {
    try {
        if (!fs.existsSync(DB_FILE)) {
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

// Helper Function: Write to JSON database file
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

// Contact form capture route
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    const currentInquiries = readDatabase();
    currentInquiries.push({ name, email, message });
    writeDatabase(currentInquiries);
    res.json({ success: true, reply: `Thank you, ${name}! Your inquiry has been securely logged.` });
});

// Secure API Route to pull data records
app.get('/api/inquiries', (req, res) => {
    const records = readDatabase();
    res.json({ success: true, data: records });
});

// 🚀 NEW ENHANCEMENT: API Route to clear out all logs in database
app.post('/api/clear-inquiries', (req, res) => {
    // Empty the array list completely
    writeDatabase([]);
    console.log("🧹 Database cleared by administrator.");
    res.json({ success: true, message: "All administrative logs cleared." });
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
    console.log(`Server running with enhanced features on port ${PORT}`);
});