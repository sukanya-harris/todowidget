const express = require("express");
const router = express.Router();
const db = require("../db");

//fetch all tasks
router.get("/", (req, res) => {
    db.all("SELECT * FROM tasks ORDER BY id ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const tasks = rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: !!row.completed
        }));
    res.json(tasks);
    });
});

//create a new task
router.post("/", (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        return res.status(400).json({ error: "Text is required" });
    }
    db.run("INSERT INTO tasks (text, completed) VALUES (?, 0)", [text.trim()], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, text: text.trim(), completed: false });
    });
});

//update a task
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    db.get("SELECT * FROM tasks WHERE id = ?", [id], function(err, row) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Task not found" });
        }

        const newText = text !== undefined ? text : row.text;
        const newCompleted = completed !== undefined ? (completed ? 1 : 0) : row.completed;

        db.run("UPDATE tasks SET text = ?, completed = ? WHERE id = ?", [newText.trim(), newCompleted, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ id: parseInt(id), text: newText.trim(), completed: newCompleted });
        });
    });
});

//remove a task
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({success: true, id: Number(id)});
    });
});

module.exports = router;