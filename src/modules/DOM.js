import { Task } from "./Task";
import { setLocalStorage, getStorage } from "./Storage";
import {
  formatDistanceToNow,
  parseISO,
  isBefore,
  startOfToday,
} from "date-fns";

const main = document.querySelector(".main");
// elementBuilder creates the dark background layer when opening the form
const overlay = elementBuilder("div", "overlay", main);
// This is array which hold all of ours tasks
export let tasksArray = [];

// Creates the HTML component, adds the class and attaches it to its parent
export function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}

// Builds the UI for the "Add" or "Edit" form.
// The 'editIndex' determines if we are making a new task or modifying an old one.

export function showForm(placeToAddTask, editIndex = null) {
  // Guard clause: prevents opening two forms at once
  if (document.querySelector(".form")) return;

  const formBox = elementBuilder("div", "form", overlay);
  const formContent = elementBuilder("div", "formContent", formBox);

  // Dynamic Header: Changes text based on the mode (Add vs Edit)
  const header = elementBuilder("h1", "header", formContent);
  header.textContent = editIndex !== null ? "Edit Task" : "Create a task";

  // Setup Inputs (Title, Description, Priority, Date)
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

  const dateInput = elementBuilder("input", "formDate", formContent);
  dateInput.type = "date";

  const submit = elementBuilder("button", "submitBtn", formContent);
  submit.textContent = editIndex !== null ? "Edit Task" : "Create Task";

  //    DELETE LOGIC: Only appears if we are in Edit Mode
  if (editIndex !== null) {
    const removeTask = elementBuilder("button", "removeTask", formContent);
    removeTask.textContent = "Delete Task";
    removeTask.addEventListener("click", () => {
      tasksArray.splice(editIndex, 1); // Remove 1 item from the array at that index
      setLocalStorage(); // Update the browser storage
      document.querySelector(".form").remove(); // Close form
      overlay.classList.replace("overlayShow", "overlay");
      displayTasks(placeToAddTask); // Refresh the task list on screen
    });
  }

  //PRE-FILL: If editing mode, put the current task's data that the user inputed back into the input fields
  // being easier and more convenient to edit
  if (editIndex !== null) {
    const task = tasksArray[editIndex];
    titleInput.value = task.title;
    textDescription.value = task.description;
    prioritySelect.value = task.priority;
    dateInput.value = task.duedate;
  }

  // Visuals: Switch overlay class to show it
  overlay.classList.remove("overlay");
  overlay.classList.add("overlayShow");

  // Transfer control to the submission handler
  submitTask(submit, placeToAddTask, editIndex);

  //   CLOSE LOGIC: Remove form if the user clicks anywhere in the dark area outside the form box
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

export function createForm(btn, container) {
  btn.addEventListener("click", () => {
    showForm(container);
  });
}

// DATA PROCESSING: Gathers the text from inputs and saves it to our array.

export function submitTask(submitBtn, container, editIndex) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Grab values using the classes we set in elementBuilder
    const title = document.querySelector(".formInput").value.trim();
    const description = document.querySelector(".formDesc").value.trim();
    const priority = document.querySelector(".formPrioSele").value;
    const duedate = document.querySelector(".formDate").value;

    if (!title || !description || !duedate) return alert("Fill everything!");

    // DATA UPDATE: If editIndex is set, overwrite that slot. Otherwise, add new.
    if (editIndex !== null) {
      tasksArray[editIndex] = new Task(title, description, duedate, priority);
    } else {
      tasksArray.push(new Task(title, description, duedate, priority));
    }

    setLocalStorage(); // Sync changes to LocalStorage
    displayTasks(container); // Update the task list UI

    document.querySelector(".form").remove();
    overlay.classList.replace("overlayShow", "overlay");
  });
}

//  THE RENDERER: Loops through tasksArray and builds the task cards on the screen.

export function displayTasks(container) {
  container.textContent = ""; // Wipe the current list so we don't get duplicates tasks show in the page
  const today = startOfToday();

  //BUILD LOGIC: build all the logic needed for each task there is on the page
  tasksArray.forEach((task, index) => {
    const taskCard = elementBuilder("div", "taskItemBox", container);
    const dateObj = parseISO(task.duedate);

    // DATE LOGIC: check if the task is in the past compared to right now
    const isOverdue = isBefore(dateObj, today);
    const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });

    taskCard.dataset.index = index;
    const layout = [
      ["h1", "taskHeader", task.title],
      ["p", "taskDescription", task.description],
      ["p", "taskDuedate", `(Due: ${relativeTime})`],
    ];

    //  PRIORITY COLORS: Adds css classes based on what priority the user has set to it
    // Green=low YellowOrange=Med and RED=High
    if (task.priority == "Low") {
      const lowPrioCircle = elementBuilder("div", "prioCircle", taskCard);
      lowPrioCircle.classList.add("lowPrio");
    }
    if (task.priority == "Med") {
      const medPrioCircle = elementBuilder("div", "prioCircle", taskCard);
      medPrioCircle.classList.add("medPrio");
    }
    if (task.priority == "High") {
      const highPrioCircle = elementBuilder("div", "prioCircle", taskCard);
      highPrioCircle.classList.add("highPrio");
    }

    // Interaction: Clicking an existing card opens the Edit form
    taskCard.addEventListener("click", () => {
      showForm(container, index);
    });

    // Populate the card with text elements
    layout.forEach(([tag, className, content]) => {
      const el = elementBuilder(tag, className, taskCard);
      el.textContent = content;

      // Conditional Formatting: If overdue, turn text red using css classes
      if (className === "taskDuedate") {
        if (isOverdue) {
          el.classList.add("overdue-text");
        } else {
          el.classList.add("taskDuedate");
        }
      }
    });
  });
}

// INITIALIZATION: The setup that runs when the page first loads.

export function initApp() {
  const nav = elementBuilder("div", "nav", main);
  const taskBox = elementBuilder("div", "content", main);
  const btn = elementBuilder("button", "btn", taskBox);
  const taskContainer = elementBuilder("div", "taskContainer", taskBox);

  btn.textContent = "Add Task";

  // Load existing data from the browser's hard drive
  tasksArray = getStorage();

  // Onboarding: If user has no tasks, show them a default "Welcome" task to get them going
  if (tasksArray.length === 0) {
    const welcomeTask = new Task(
      "Welcome !",
      "Click any card to edit details or delete the task The colored bar at the top shows priority: Green (Low), Yellow (Med), Red (High).Use Add Task to start fresh. Your changes are saved automatically to your browser.",
      "2026-05-01",
      "Med",
    );
    tasksArray.push(welcomeTask);
    setLocalStorage();
  }

  createForm(btn, taskContainer); // Connect button to form
  displayTasks(taskContainer); // Draw the cards
}

getStorage(); // Final check/pull of data
