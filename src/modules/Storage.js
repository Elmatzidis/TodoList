import {tasksArray} from "./DOM"
// STORING DATA: stores the data to the browsers localStorage so the user doesn't loose their tasks

export function setLocalStorage() {
  localStorage.setItem(`tasksArray`, JSON.stringify(tasksArray));
}

//Retrieves data from local storage and makes them readable
export function getStorage() {
  const savedTasks = localStorage.getItem("tasksArray");
  return savedTasks ? JSON.parse(savedTasks) : [];
}