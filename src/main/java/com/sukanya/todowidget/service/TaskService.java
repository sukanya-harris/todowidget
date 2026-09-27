package com.sukanya.todowidget.service;

import com.sukanya.todowidget.model.Task;
import com.sukanya.todowidget.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TaskService {
    @Autowired
    private TaskRepository repository;

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task createTask(Task task) {
        task.setCompleted(false); //new tasks are not completed by default
        return repository.save(task);
    }

    public Task updateTask(String id, Task updatedTask) {
        Task existingTask = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Task not found with id: " + id));
        if (updatedTask.isCompleted() != null) {
            existingTask.setCompleted(updatedTask.isCompleted());
        }
        return repository.save(existingTask);
    }

    public void deleteTask(String id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
        repository.deleteById(id);
    }
}