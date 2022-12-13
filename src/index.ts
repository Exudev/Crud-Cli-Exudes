#!/usr/bin/env node
// import { TaskCollection } from "./models/TaskCollection.js";
import inquirer from "inquirer";
import { JsonTaskCollection } from "./models/JsonTaskCollection.js";
import { tasks } from "./exampleData.js";
import { Commands } from "./commands.js";



const collection = new JsonTaskCollection("Exudes", tasks);
let showCompleted = true;

function displayTaskList(): void {
  console.log(
    `${collection.userName}'s Tasks ` +
      `(${collection.getTaskCounts().incomplete} tasks to do)`
  );
  collection.getTaskItems(showCompleted).forEach((task: { printDetails: () => any; }) => task.printDetails());
}

async function promptAdd(): Promise<void> {
  console.clear();
  const answers = await inquirer.prompt({
    type: "input",
    name: "add",
    message: "Enter task:",
  });
  if (answers["add"] !== "") {
    collection.addTask(answers["add"]);
  }
  promptUser();
}

async function promptComplete(): Promise<void> {
  console.clear();
  const answers = await inquirer.prompt({
    type: "checkbox",
    name: "complete",
    message: "Mark Task Complete",
    choices: collection.getTaskItems(showCompleted).map((item: { task: any; id: any; complete: any; }) => ({
      name: item.task,
      value: item.id,
      checked: item.complete,
    })),
  });
  let completedTasks = answers["complete"] as number[];
  collection
    .getTaskItems(true)
    .forEach((item: { id: number; }) =>
      collection.markComplete(
        item.id,
        completedTasks.find((id) => id === item.id) != undefined
      )
    );
  promptUser();
}

async function promptUser(): Promise<void> {
  console.clear();
  displayTaskList();
  const answers = await inquirer.prompt({
    type: "list",
    name: "command",
    message: "Choose option",
    choices: Object.values(Commands),
  });
  switch (answers["command"]) {
    case Commands.Toggle:
      showCompleted = !showCompleted;
      promptUser();
      break;
    case Commands.Add:
      promptAdd();
      break;
    case Commands.Complete:
      if (collection.getTaskCounts().incomplete > 0) {
        promptComplete();
      } else {
        promptUser();
      }
      break;
    case Commands.Purge:
      collection.removeComplete();
      promptUser();
      break;
  }
}

promptUser();