//BUIDLIG TASK: this is the structure for each task there is in the page
export class Task {
  constructor(title, description, duedate, priority) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
  }
}
