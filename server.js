const express = require('express');
const path = require('path');
const fs = require("fs");
const uniqid = require('uniqid');

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3000;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Get routes for home and notes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

app.get('/api/notes', (req, res) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.send(data)
        }
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile("db/db.json", "utf8", (error, data) => {
        if (error) {
            console.error(error)
        }
        else {
            let notes = JSON.parse(data);
            console.log(notes);
            const newNote = req.body
            newNote.id = uniqid();
            notes.push(newNote);
            fs.writeFile("db/db.json", JSON.stringify(notes), (err) =>
                err ? console.error(err) : console.log('New Note Saved'))
            res.send(newNote);
        };
    })
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
