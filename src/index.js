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

function createForm(btn) {
  btn.addEventListener("click", () => {
    const formBox = elementBuilder("div", "form", main);
    const formContent = elementBuilder("div", "formContent", formBox);
    const titleInput = elementBuilder("input", "form-input", formContent);
    titleInput.placeholder = "Task Titlte";
    titleInput.type = "text";
    const textDescription = elementBuilder(
      "textarea",
      "form-desc",
      formContent,
    );
    textDescription.placeholder = "Description...";

    const prioritySelect = elementBuilder(
      "select",
      "form-prio-sele",
      formContent,
    );

    formBox.style.display = "block";
  });
}

function initApp() {
  const nav = elementBuilder("div", "nav", main);
  const taskBox = elementBuilder("div", "content", main);
  const btn = elementBuilder("button", "btn", taskBox);
  const taskContainer = elementBuilder("div", "taskContainer", taskBox);

  btn.textContent = "Add Task";

  const todo1 = new Task("Walk", "Walk the dog", "2026-05-01", "High");
  const todo2 = new Task("Gym", "Leg day", "2026-05-02", "Medium");
  tasksArray.push(todo1, todo2);

  createForm(btn);
  displayTasks(taskContainer);
}

initApp();
