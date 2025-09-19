document.addEventListener('DOMContentLoaded', () => {
    const formInput = document.getElementById("input-area");
    const inputTask = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const closeBtn = document.getElementById("closeBtn");

    closeBtn.addEventListener("click", () => {
        window.close();
    });

    const saveTasks = () => {
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
    loadTasks();
});