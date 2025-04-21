const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const currentStatus = document.getElementById("status");

const taskData = JSON.parse(localStorage.getItem("data")) || []; // CONVERTS THE JSON STRING INTO KEYS, VALUES, OBJECTS THAT CAN BE USED BY JAVASCRIPT

let currentTask = {};

// REMOVE WHITESPACE WITH TRIM AND REPLACE WITH A REGEX CAPTURE GROUP
const removeSpecialCharacters = (val) =>
  val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");

const addOrUpdateTask = () => {
  // EMPTY STRING IS FALSY, '!' NEGATES IT MAKING IT TRUE
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id); // RETURNS THE INDEX OF THE FIRST ITEM THAT SATISFIES THE CONDITION

  const taskObj = {
    id: `${removeSpecialCharacters(titleInput.value)
      .toLowerCase()
      .split(" ")
      .join("-")}-${Date.now()}`,
    title: removeSpecialCharacters(titleInput.value),
    date: dateInput.value,
    description: descriptionInput.value,
    status: currentStatus.value, // VALUE SHOULD BE THE SAME VALUE IN <OPTION>
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj); // ADDS THE TASKOBJ TO THE TASKDATA ARR AND RETURNS THE LENGTH OF THE NEW ARRAY
  } else {
    taskData[dataArrIndex] = taskObj; // UPDATES THE INDEX OF THE ARRAY WITH THE UPDATED VALUE
  }

  localStorage.setItem("data", JSON.stringify(taskData)); // CONVERTS THE KEY-VALUE PAIRS BACK INTO A STRING BECAUSE LOCALSTORAGE IS DESIGNED TO STORE STRINGS
  updateTaskContainer();
  reset();
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  // REMOVED ONCLICK AND REWROTE THE FUNCTION BELOW TO MAKE THE CODE CLEANER
  // CLASSES CAN BE USED WITHOUT NEEDING TO STYLE IT (ALSO USED FOR TARGETTING IN JAVASCRIPT)
  taskData.forEach(({ id, title, date, description, status }) => {
    tasksContainer.innerHTML += `
      <div class="task" id="${id}">
        <div class="task-header task-container">
          <p><strong>Title:</strong> ${title} </p>
          <i class="ri-arrow-down-s-line toggle-arrow" onclick="toggleDetails(this)"></i>
        </div>
        <div class="task-details task-container">
          <p><strong>Date: </strong>${date} </p>
          <p><strong>Remarks: </strong> <br>${description} </p>
          <p><strong>Status: </strong>${status} </p>
          <button type="button" class="btn edit-btn">Edit</button>
          <button type="button" class="btn delete-btn">Delete</button>
        </div>
      </div>
    `;

    const editBtn = document.querySelectorAll(".edit-btn");
    editBtn.forEach((button) =>
      button.addEventListener("click", (e) => {
        editTask(e.target);
      })
    );

    const deleteBtn = document.querySelectorAll(".delete-btn");
    deleteBtn.forEach((button) =>
      button.addEventListener("click", (e) => deleteTask(e.target))
    );
  });
};

const toggleDetails = (icon) => {
  const task = icon.closest(".task");
  const details = task.querySelector(".task-details");

  details.classList.toggle("expanded");
  icon.classList.toggle("rotated");
};

const deleteTask = (buttonElement) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonElement.parentElement.parentElement.id
  );

  // REMOVES THE BUTTON, REMOVES 1 ITEM FROM THE INDEX OF THE 'dataArrIndex' AND SAVES IT BACK TO LOCAL STORAGE
  buttonElement.parentElement.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

// ADDED HIDE ICON FUNCTION THAT SELECTS ALL THE ARROW ICONS WHEN CLICKING EDIT OR NEW TASK AND HIDES THEM
const hideIcon = () => {
  const allArrows = document.querySelectorAll(".toggle-arrow");
  allArrows.forEach((arrow) => {
    arrow.classList.add("hidden");
  });
};

// ADDED SHOW ICON FUNCTION THAT SELECTS ALL THE ARROW ICONS WHEN CLICKING EXIT BUTTON
const showIcon = () => {
  const allArrows = document.querySelectorAll(".toggle-arrow");
  allArrows.forEach((arrow) => {
    arrow.classList.remove("hidden");
  });
};

const editTask = (buttonElement) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonElement.parentElement.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;
  currentStatus.value = currentTask.status;

  addOrUpdateTaskBtn.innerText = "Update";

  taskForm.classList.toggle("hidden");
  hideIcon();
};

const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  currentStatus.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () => {
  taskForm.classList.toggle("hidden");

  if (!taskForm.classList.contains("hidden")) {
    hideIcon();
  } else {
    showIcon();
  }
});

closeTaskFormBtn.addEventListener("click", () => {
  // CHECKS IF ONE OF THEM HAS A VALUE
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;

  // CHECKS IF THE CURRENT VALUE IS NOT THE SAME AS THE ORIGINAL VALUE
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  // CHECKS IF THE USER INPUTS AT LEAST ONE AND AT LEAST ONE OF THE CURRENT VALUES IS NOT THE SAME AS THE ORIGINAL VALUE
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
  showIcon();
});

cancelBtn.addEventListener("click", confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});
