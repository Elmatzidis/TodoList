import "./style.css";

const main = document.querySelector(".main");
let tasksArray = [];

class Task {
  constructor(title, description, duedate, priority) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
  }
}

function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}

function displayTasks(container) {
  container.textContent = "";

  tasksArray.forEach((task) => {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task-item");
    taskElement.textContent = `${task.title} - ${task.description} (Due: ${task.duedate})`;
    container.appendChild(taskElement);
  });
}

function submitTask(submitBtn, container) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const title = document.querySelector(".formInput").value;
    const description = document.querySelector(".formDesc").value;
    const priority = document.querySelector(".formPrioSele").value;

    if (!title) return alert("Please enter a title!");

    const newTask = new Task(title, description, "2026-05-01", priority);
    tasksArray.push(newTask);

    displayTasks(container);

    const form = document.querySelector(".form");
    if (form) form.remove();
  });
}

function createForm(btn, placeToAddTask) {
  btn.addEventListener("click", () => {
    if (document.querySelector(".form")) return;

    const formBox = elementBuilder("div", "form", main);
    const formContent = elementBuilder("div", "formContent", formBox);

    const header = elementBuilder("h1", "header", formContent);
    header.textContent = "Create a task";

    const titleInput = elementBuilder("input", "formInput", formContent);
    titleInput.placeholder = "Task Title";

    const textDescription = elementBuilder("textarea", "formDesc", formContent);
    textDescription.placeholder = "Description...";

    const prioritySelect = elementBuilder(
      "select",
      "formPrioSele",
      formContent,
    );
    ["Low", "Med", "High"].forEach((option) => {
      const opt = elementBuilder("option", "", prioritySelect);
      opt.value = option;
      opt.textContent = option;
    });

    const submit = elementBuilder("button", "submitBtn", formContent);
    submit.textContent = "Save Task";
    submitTask(submit, placeToAddTask);
  });
}

function initApp() {
  const nav = elementBuilder("div", "nav", main);
  const taskBox = elementBuilder("div", "content", main);
  const btn = elementBuilder("button", "btn", taskBox);
  const taskContainer = elementBuilder("div", "taskContainer", taskBox);

  btn.textContent = "Add Task";

  const todo1 = new Task("Walk", "Walk the dog", "2026-05-01", "High");
  tasksArray.push(todo1);
  createForm(btn, taskContainer);

  displayTasks(taskContainer);
}

initApp();
