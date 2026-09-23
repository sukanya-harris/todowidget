const express = require("express");
const cors = require("cors");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

function startServer() {
    return app.listen(PORT, () => {
        console.log(`Task server running as http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = {app, startServer};