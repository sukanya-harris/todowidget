package com.sukanya.todowidget.controller;

import com.sukanya.todowidget.model.Task;
import com.sukanya.todowidget.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    //get tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    //post tasks
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    //put tasksID
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask);
    }

    //delete tasksID
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable String id) {
        taskService.deleteTask(id);
        return Map.<String, Object>of("success", true, "id", id);
    }
}