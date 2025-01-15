const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.NOTES_APP_PORT || 8080;

let notes = [];

const findNoteIndexById = (id) => notes.findIndex((note) => note.id === id);

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const note = notes.find((n) => n.id === noteId);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.post('/notes', (req, res) => {
    const { note, autor, date } = req.body;
    if (!note || !autor || !date) {
        return res.status(400).json({ message: 'Missing fields in request body' });
    }
    const newNote = { id: `${Date.now()}`, note, autor, date };
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { note, autor, date } = req.body;

    if (!note || !autor || !date) {
        return res.status(400).json({ message: 'Missing fields in request body' });
    }

    const noteIndex = findNoteIndexById(noteId);
    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }

    notes[noteIndex] = { id: noteId, note, autor, date };
    res.json(notes[noteIndex]);
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = findNoteIndexById(noteId);

    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const deletedNote = notes.splice(noteIndex, 1);
    res.json(deletedNote);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
