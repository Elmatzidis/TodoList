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

function createForm(btn, placeToAddTask) {
  btn.addEventListener("click", () => {
    // 1. Safety check: If form exists, don't make another
    if (document.querySelector(".form")) return;

    // 2. Build the Form
    const formBox = elementBuilder("div", "form", overlay);
    const formContent = elementBuilder("div", "formContent", formBox);

    const header = elementBuilder("h1", "header", formContent);
    header.textContent = "Create a task";

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
    submit.textContent = "Save Task";

    // 3. Show Overlay
    overlay.classList.remove("overlay");
    overlay.classList.add("overlayShow");

    // 4. Initialize Submit Logic
    submitTask(submit, placeToAddTask);

    // 5. THE FIX: The "Click Outside" Closer
    // Define the function separately so we can clean it up
    const closeOnOverlayClick = (e) => {
      if (e.target === overlay) {
        // REMOVE the form, don't just hide it!
        formBox.remove(); 
        
        // Reset overlay state
        overlay.classList.remove("overlayShow");
        overlay.classList.add("overlay");

        // Important: Remove this specific listener so they don't stack up
        overlay.removeEventListener("click", closeOnOverlayClick);
      }
    };

    overlay.addEventListener("click", closeOnOverlayClick);
  });
}

function submitTask(submitBtn, container) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const titleInput = document.querySelector(".formInput");
    const descInput = document.querySelector(".formDesc");
    const prioritySelect = document.querySelector(".formPrioSele");

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const priority = prioritySelect.value;

    if (!title || !description) {
      alert("Please enter both a title and a description!");
      return; 
    }

    const newTask = new Task(title, description, "2026-05-01", priority);
    tasksArray.push(newTask);

    displayTasks(container);

    const form = document.querySelector(".form");
    if (form) form.remove();

    overlay.classList.remove("overlayShow");
    overlay.classList.add("overlay");
  });
}

function displayTasks(container) {
  container.textContent = "";

  tasksArray.forEach((task) => {
    // Create the parent card for this specific task
    const taskCard = elementBuilder("div", "taskItemBox", container);

    // Define the "Mapping": [tag, class, value]
    const layout = [
      ["h1", "taskHeader", task.title],
      ["p", "taskDescription", task.description],
      ["p", "taskDuedate", `(Due: ${task.duedate})`],
    ];

    // Build everything in 3 lines of code
    layout.forEach(([tag, className, content]) => {
      const el = elementBuilder(tag, className, taskCard);
      el.textContent = content;
    });
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
