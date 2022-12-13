export class TaskItem {
    id;
    task;
    complete;
    constructor(id, task, complete = false) {
        this.id = id;
        this.task = task;
        this.complete = complete;
    }
    printDetails() {
        console.log(`${this.id} ${this.task} ${this.complete ? "(complete)" : ""}`);
    }
}
