const API_BASE = "http://localhost:3000/tasks";

document.addEventListener('DOMContentLoaded', () => {
    const formInput = document.getElementById("input-area");
    const inputTask = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const closeBtn = document.getElementById("closeBtn");

    closeBtn.addEventListener("click", () => {
        window.close();
    });

    //API helpers
    async function fetchTasks() {
        const response = await fetch(API_BASE);
        return response.json();
    }

    async function createTask(text) {
        const response = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });
        return response.json();
    }

    async function updateTask(id, text, completed) {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, completed })
        });
        return response.json();
    }

    async function deleteTask(id) {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });
        return response.json();
    }

    //Rendering
    async function loadTasks() {
        try {
            const tasks = await fetchTasks();
            taskList.innerHTML = "";
            tasks.forEach(task => renderTask(task));
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }

    function renderTask({id, text, completed}) {
        const li = document.createElement("li");
        li.innerHTML = `
            <label class="customCheckbox"><input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}><span class="checkmark"></span></label>
            <span class="task">${text}</span>
            <div class="taskButtons">
                <button class="editBtn"><img src="resources/edit.png" alt="Edit"></button>
                <button class="deleteBtn"><img src="resources/remove.png" alt="Delete"></button>
            </div>
        `;
        
        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".editBtn");

        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = 0.5;
            editBtn.style.pointerEvents = "none";
        }
        
        checkbox.addEventListener("change", async () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? 0.5 : 1;
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            try {
                await updateTask(id, undefined, {completed: isChecked});
            } catch (error) {
                console.error("Error updating task:", error);
            }
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                inputTask.value = li.querySelector(".task").textContent;
                deleteTask(id).catch(error => console.error("Error deleting task:", error));
                li.remove();
            }
        });

        li.querySelector(".deleteBtn").addEventListener("click", async () => {
            try {
                await deleteTask(id);
                taskList.removeChild(li);
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        });
        taskList.appendChild(li);
    }

    async function addTask(event) {
        if (event) event.preventDefault();
        const text = inputTask.value.trim();
        if (!text) {
            return;
        }
        try {
            const newTask = await createTask(text);
            renderTask(newTask);
            inputTask.value = "";
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }
    addBtn.addEventListener("click", (event) => addTask(event));

    function resizeToContent() {
        const {ipcRenderer} = require("electron");
        const container = document.getElementById("container");
        ipcRenderer.send("resize-window", container.scrollHeight);
    }

    inputTask.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask(event);
        }
    });

    loadTasks();







//local storage code
    /* const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => {
            return {
                text: li.querySelector(".task").textContent,
                completed: li.classList.contains("completed")
            };
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => addTask(task.text, task.completed, false));
    }
    
    function addTask(text, completed = false) {
        event.preventDefault();
        const task = text || inputTask.value.trim();
        if (!task) {
            return;
        }
        const li = document.createElement("li");
        
        li.innerHTML = `
        <label class="customCheckbox"><input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}><span class="checkmark"></span></label>
        <span class="task">${task}</span>
        <div class="taskButtons">
            <button class="editBtn"><img src="resources/edit.png" alt="Edit"></button>
            <button class="deleteBtn"><img src="resources/remove.png" alt="Delete"></button>
        </div>
        `;

        const checkbox = li.querySelector(".checkbox");
        const editBtn = li.querySelector(".editBtn");
        
        if (completed) {
            li.classList.add("completed");
            editBtn.disabled = true;
            editBtn.style.opacity = 0.5;
            editBtn.style.pointerEvents = "none";
        }
        
        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? 0.5 : 1;
            editBtn.style.pointerEvents = isChecked ? "none" : "auto";
            saveTasks();
        });

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                inputTask.value = li.querySelector(".task").textContent;
                li.remove();
                saveTasks();
            }
        });
        li.querySelector(".deleteBtn").addEventListener("click", () => {
                taskList.removeChild(li);
                saveTasks();
        });

        taskList.appendChild(li);
        inputTask.value = "";
        saveTasks();
    }

    addBtn.addEventListener("click", () => addTask());

    function resizeToContent() {
        const { ipcRenderer } = require("electron");
        const container = document.getElementById("container");
        ipcRenderer.send("resize-window", container.scrollHeight);
}


    inputTask.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });
    loadTasks(); */
});