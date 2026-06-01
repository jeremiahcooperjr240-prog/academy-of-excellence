const express = require('express');
const path = require('path');
const app = express();

// Use the dynamic cloud port, or default to 3000 for your local computer
const PORT = process.env.PORT || 3000;

// Middleware to understand incoming form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve all your frontend files (HTML, CSS, Images) from the current folder
app.use(express.static(path.join(__dirname)));

// Route for your Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the About Page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Route for the Academics Page
app.get('/academics', (req, res) => {
    res.sendFile(path.join(__dirname, 'academics.html'));
});

// Route for the Contact Page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// A sample Backend API route for your Contact Form
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // For now, let's log it to the terminal to prove the backend received it!
    console.log(`New Message Received! Name: ${name}, Email: ${email}`);
    
    // Send a success message back to the frontend browser
    res.json({ success: true, reply: `Thank you, ${name}! Your message was received.` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT}`);
});