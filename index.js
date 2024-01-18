import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://mobile-project-b8bef-default-rtdb.firebaseio.com",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListInDB = ref(database, "taskList");

// html element variables
const inputField = document.getElementById("inputField");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
let taskAmount = 0;

addButton.addEventListener("click", function () {
    let inputValue = inputField.value;
    if (inputValue != "" && taskAmount < 5) {
        push(taskListInDB, inputValue);
        taskAmount++;
    } else if (inputValue == "") {
        alert("Sorry, you need to write something");
    } else {
        alert("You have reached the maxinum amount of tasks");
    }
    clearInput();
});

function clearInput() {
    inputField.value = "";
}

onValue(taskListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let taskArray = Object.entries(snapshot.val());
        clearTaskList();

        for (let i = 0; i < taskArray.length; i++) {
            let currentTask = taskArray[i];
            addTask(currentTask);
        }
    } else {
        clearTaskList();
    }
});

function clearTaskList() {
    taskList.innerHTML = "";
}

function addTask(taskEntry) {
    let taskID = taskEntry[0];
    let taskItem = taskEntry[1];
    let newElement = document.createElement("li");
    newElement.textContent = taskItem;

    newElement.addEventListener("click", function () {
        let taskLocation = ref(database, `taskList/${taskID}`);
        remove(taskLocation);
        taskAmount--;
        if (taskAmount < 0) {
            taskAmount = 0;
        }
    });

    taskList.append(newElement);
}
