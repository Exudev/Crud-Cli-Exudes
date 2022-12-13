import { TaskItem } from "./TaskItem.js";
export class TaskCollection {
    userName;
    taskItems;
    nextId = 1;
    taskMap = new Map();
    constructor(userName, taskItems = []) {
        this.userName = userName;
        this.taskItems = taskItems;
        taskItems.forEach(item => this.taskMap.set(item.id, item));
    }
    addTask(task) {
        while (this.getTaskById(this.nextId)) {
            this.nextId++;
        }
        this.taskMap.set(this.nextId, new TaskItem(this.nextId, task));
        return this.nextId;
    }
    getTaskItems(includeComplete) {
        return [...this.taskMap.values()].filter(task => includeComplete || !task.complete);
    }
    getTaskById(id) {
        return this.taskMap.get(id);
    }
    markComplete(id, complete) {
        const taskItem = this.getTaskById(id);
        if (taskItem) {
            taskItem.complete = complete;
        }
    }
    removeComplete() {
        this.taskMap.forEach(item => {
            if (item.complete) {
                this.taskMap.delete(item.id);
            }
        });
    }
    getTaskCounts() {
        return {
            total: this.taskMap.size,
            incomplete: this.getTaskItems(false).length
        };
    }
}
