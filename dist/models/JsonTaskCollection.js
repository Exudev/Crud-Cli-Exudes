import { TaskItem } from "./TaskItem.js";
import { TaskCollection } from "./TaskCollection.js";
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
export class JsonTaskCollection extends TaskCollection {
    username;
    database;
    constructor(username, taskItems = []) {
        super(username, []);
        this.username = username;
        const adapter = new JSONFile("Tasks.json");
        this.database = new Low(adapter);
        this.database.read();
        console.log(this.database);
        if (this.database.data) {
            let dbItems = this.database.data.tasks;
            dbItems.forEach((item) => this.taskMap.set(item.id, new TaskItem(item.id, item.task, item.complete)));
        } /*else {
          this.database.data = { tasks: taskItems };
          this.database.write();
          taskItems.forEach((item) => this.taskMap.set(item.id, item));
        }
        */
    }
    addTask(task) {
        let result = super.addTask(task);
        this.storeTasks();
        return result;
    }
    markComplete(id, complete) {
        super.markComplete(id, complete);
        this.storeTasks();
    }
    removeComplete() {
        super.removeComplete();
        this.storeTasks();
    }
    async storeTasks() {
        this.database.data = { tasks: [...this.taskMap.values()] };
        await this.database.write();
    }
}
