import "./style.css";

const main = document.querySelector(".main");
const overlay = elementBuilder("div", "overlay", main);
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

function showForm(placeToAddTask, editIndex = null) {
  if (document.querySelector(".form")) return;

  const formBox = elementBuilder("div", "form", overlay);
  const formContent = elementBuilder("div", "formContent", formBox);

  const header = elementBuilder("h1", "header", formContent);
  header.textContent = editIndex !== null ? "Edit Task" : "Create a task";

  const titleInput = elementBuilder("input", "formInput", formContent);
  titleInput.placeholder = "Task Title";

  const textDescription = elementBuilder("textarea", "formDesc", formContent);
  textDescription.placeholder = "Description...";

  const prioritySelect = elementBuilder("select", "formPrioSele", formContent);
  ["Low", "Med", "High"].forEach((option) => {
    const opt = elementBuilder("option", "", prioritySelect);
    opt.value = option;
    opt.textContent = option;
  });

  const submit = elementBuilder("button", "submitBtn", formContent);
  submit.textContent = editIndex !== null ? "Edit task" : "Create Task";

  if (editIndex !== null) {
    const task = tasksArray[editIndex];
    titleInput.value = task.title;  
    textDescription.value = task.description;
    prioritySelect.value = task.priority;
  }

  overlay.classList.remove("overlay");
  overlay.classList.add("overlayShow");

  submitTask(submit, placeToAddTask,editIndex)

  const closeOnOverlayClick = (e) => {
    if (e.target === overlay) {
      formBox.remove();

      overlay.classList.remove("overlayShow");
      overlay.classList.add("overlay");
      overlay.removeEventListener("click", closeOnOverlayClick);
    }
  };

  overlay.addEventListener("click", closeOnOverlayClick);
}

function submitTask(submitBtn, container, editIndex) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const title = document.querySelector(".formInput").value.trim();
    const description = document.querySelector(".formDesc").value.trim();
    const priority = document.querySelector(".formPrioSele").value;

    if (!title || !description) return alert("Fill everything!");

    if (editIndex !== null) {
      tasksArray[editIndex] = new Task(title, description, "2026-05-01", priority);
    } else {
      tasksArray.push(new Task(title, description, "2026-05-01", priority));
    }

    displayTasks(container); 
    
    document.querySelector(".form").remove();
    overlay.classList.replace("overlayShow", "overlay");
  });
}

function displayTasks(container) {
   container.textContent = "";
    
  tasksArray.forEach((task, index) => {
    const taskCard = elementBuilder("div", "taskItemBox", container);
    taskCard.dataset.index = index; 
    const layout = [
      ["h1", "taskHeader", task.title],
      ["p", "taskDescription", task.description],
      ["p", "taskDuedate", `(Due: ${task.duedate})`],
    ];

    taskCard.addEventListener("click", () => {
      showForm(container, index);
    });
    layout.forEach(([tag, className, content]) => {
      const el = elementBuilder(tag, className, taskCard);
      el.textContent = content;
    });
  });
}

function createForm(btn, container) {
  btn.addEventListener("click", () => {
    showForm(container);
  });
}

function initApp() {
  const nav = elementBuilder("div", "nav", main);
  const taskBox = elementBuilder("div", "content", main);
  const btn = elementBuilder("button", "btn", taskBox);
  const taskContainer = elementBuilder("div", "taskContainer", taskBox);

  btn.textContent = "Add Task";

  const todo1 = new Task(
    "Walk",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ipsam itaque maiores neque vel, voluptatum facilis reprehenderit tempora doloremque mollitia libero quod, corporis veniam ipsum, quas numquam? Temporibus hic, ullam cum mollitia reiciendis facilis quo! Ullam atque rerum omnis vero?",
    "2026-05-01",
    "High",
  );
  const todo2 = new Task(
    "Walk",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ipsam itaque maiores neque vel, voluptatum facilis reprehenderit tempora doloremque mollitia libero quod, corporis veniam ipsum, quas numquam? Temporibus hic, ullam cum mollitia reiciendis facilis quo! Ullam atque rerum omnis vero?",
    "2026-05-01",
    "High",
  );
  const todo3 = new Task(
    "Walk",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ipsam itaque maiores neque vel, voluptatum facilis reprehenderit tempora doloremque mollitia libero quod, corporis veniam ipsum, quas numquam? Temporibus hic, ullam cum mollitia reiciendis facilis quo! Ullam atque rerum omnis vero?",
    "2026-05-01",
    "High",
  );
  const todo4 = new Task(
    "Walk",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint ipsam itaque maiores neque vel, voluptatum facilis reprehenderit tempora doloremque mollitia libero quod, corporis veniam ipsum, quas numquam? Temporibus hic, ullam cum mollitia reiciendis facilis quo! Ullam atque rerum omnis vero?",
    "2026-05-01",
    "High",
  );

  tasksArray.push(todo1, todo2, todo3, todo4);
  createForm(btn, taskContainer);
  displayTasks(taskContainer);
}

initApp();
