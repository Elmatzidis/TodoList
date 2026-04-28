import "./style.css";

// 1. SELECTORS & STATE
const main = document.querySelector(".main");
const taskBox = document.createElement("div");
const taskContainer = document.createElement("div");
let tasks = [];

class Task {
  constructor(title, description, duedate, priority) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
  }
}

function displayTasks() {
  tasks.forEach((task) => {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task-item");
    taskElement.textContent = `${task.title} - ${task.description} (Due: ${task.duedate})`;
    taskContainer.appendChild(taskElement);
  });
}

function initApp() {
  taskBox.classList.add("content");
  main.appendChild(taskBox);
  taskContainer.classList.add("taskContainer")
  taskBox.appendChild(taskContainer)

  const todo1 = new Task("Walk", "Walk the dog", "2026-05-01", "High");
  const todo2 = new Task("Gym", "Leg day", "2026-05-02", "Medium");
  tasks.push(todo1, todo2);

  displayTasks();
}

initApp();
