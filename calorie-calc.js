const caloriesToday = document.getElementById("calories-today");
const overlay = document.querySelector(".background-overlay");
const caloriesDisplay = document.getElementById("calories-display")

// Organized meals for a cleaner code
const meals = {
  breakfast: {
    totalCal: document.getElementById("breakfast-total-calories"),
    foodForm: document.getElementById("breakfast-food-form"),
    addFoodBtn: document.getElementById("breakfast-add-food-button"),
    clearBtn: document.getElementById("breakfast-clear-button"),
    addBtn: document.getElementById("breakfast-add-button"),
    cancelBtn: document.getElementById("breakfast-cancel-button"),
    foodInput: document.getElementById("bfast-food-name"),
    foodCal: document.getElementById("bfast-calories"),
    nameKey: "breakfastFood",
    calKey: "breakfastCalories",
    foodContainer: document.getElementById("breakfast-food-container")
  },

  lunch: {
    totalCal: document.getElementById("lunch-total-calories"),
    foodForm: document.getElementById("lunch-food-form"),
    addFoodBtn: document.getElementById("lunch-add-food-button"),
    clearBtn: document.getElementById("lunch-clear-button"),
    addBtn: document.getElementById("lunch-add-button"),
    cancelBtn: document.getElementById("lunch-cancel-button"),
    foodInput: document.getElementById("lunch-food-name"),
    foodCal: document.getElementById("lunch-calories"),
    nameKey: "lunchFood",
    calKey: "lunchCalories",
    foodContainer: document.getElementById("lunch-food-container")
  },

  dinner: {
    totalCal: document.getElementById("dinner-total-calories"),
    foodForm: document.getElementById("dinner-food-form"),
    addFoodBtn: document.getElementById("dinner-add-food-button"),
    clearBtn: document.getElementById("dinner-clear-button"),
    addBtn: document.getElementById("dinner-add-button"),
    cancelBtn: document.getElementById("dinner-cancel-button"),
    foodInput: document.getElementById("dinner-food-name"),
    foodCal: document.getElementById("dinner-calories"),
    nameKey: "dinnerFood",
    calKey: "dinnerCalories",
    foodContainer: document.getElementById("dinner-food-container")
  },

  snacks: {
    totalCal: document.getElementById("snacks-total-calories"),
    foodForm: document.getElementById("snacks-food-form"),
    addFoodBtn: document.getElementById("snacks-add-food-button"),
    clearBtn: document.getElementById("snacks-clear-button"),
    addBtn: document.getElementById("snacks-add-button"),
    cancelBtn: document.getElementById("snacks-cancel-button"),
    foodInput: document.getElementById("snacks-food-name"),
    foodCal: document.getElementById("snacks-calories"),
    nameKey: "snacksFood",
    calKey: "snacksCalories",
    foodContainer: document.getElementById("snacks-food-container")
  },
};



// Removes trailing whitespaces, and removes any character that is NOT letters, hyphens, and spaces. Replace it with an empty string
const removeSpecialCharacters = (value) => {
  return value.trim().replace(/[^0-9\p{L}\s\-\/]/gu, "");
};



// Function block to dynamically add multiples items for each form
const addFood = (mealType) => {
  // Used [mealType] instead of dot notation since mealType is not a static, known property name. Bracket notation is for accessing dynamic, variable property names
  const meal = meals[mealType];
  const foodName = meal.foodInput.value;
  const foodCalories = meal.foodCal.value;

  // Checks if foodName or foodCalories are blank and issues an alert if it is blank
  if (!foodName || !foodCalories) {
    alert("Please provide a valid food name and calorie amount.");
    return;
  }

  // Create new object with 'name' and 'calories' as property
  const newFoodItem = {
    name: removeSpecialCharacters(foodName),
    calories: foodCalories,
  };

  // This retrieves existing arrays from localStorage or creates empty arrays if none exist
  // The || [] is the 'fallback' or the 'default value' and is essential for handling the first-time use case when no data has been saved yet, preventing errors and allowing your code to work correctly from the beginning.
  let storedFoodNames = JSON.parse(localStorage.getItem(meal.nameKey)) || [];
  let storedCalories = JSON.parse(localStorage.getItem(meal.calKey)) || [];

  // Adds the item into the array
  storedFoodNames.push(newFoodItem.name);
  storedCalories.push(newFoodItem.calories);

  // Converts it back into a JSON string
  localStorage.setItem(meal.nameKey, JSON.stringify(storedFoodNames));
  localStorage.setItem(meal.calKey, JSON.stringify(storedCalories));
  updateFoodContainer(mealType);
};



// Display food into the container
const updateFoodContainer = (mealType) => {
  const meal = meals[mealType];
  const foodHolder = meal.foodContainer;

  foodHolder.innerHTML = ""; // To prevent duplication of data

  const storedFoodNames = JSON.parse(localStorage.getItem(meal.nameKey)) || [];
  const storedCalories = JSON.parse(localStorage.getItem(meal.calKey)) || [];

  storedFoodNames.forEach((name, calIndex) => {
    const calories = storedCalories[calIndex];
    foodHolder.innerHTML += `
      <div class="meal-display">
        <p>${name}</p>
        <p>${calories} cal</p>
      </div>
    `
  })
}



// Clear food entries
const clearFood = (mealType) => {
  const meal = meals[mealType];
  const foodHolder = meal.foodContainer;
  const mealTypeCalories = meal.totalCal;

  // 1. Get the calories of the meal to be cleared *before* clearing local storage
  let caloriesToRemove = 0;
  const storedCaloriesValues = JSON.parse(localStorage.getItem(meal.calKey));
  if (storedCaloriesValues) {
    caloriesToRemove = storedCaloriesValues.reduce((acc, currVal) => acc + parseInt(currVal), 0)
  }

  // 2. Clear the stored data for the meal
  localStorage.removeItem(meal.nameKey);
  localStorage.removeItem(meal.calKey);

  // 3. Clear the display for the meal
  foodHolder.innerHTML = "";  // Could be backticks if you're dynamically adding data
  mealTypeCalories.textContent = "0 cal";

  // 4. Update the "Today's Calories" display
  updateCaloriesToday(caloriesToRemove)
}


// Display total calories per meal
const displayMealTypeTotalCalories = (mealType) => {
  const meal = meals[mealType];
  const mealTypeCalories = meal.totalCal;

  const storedCalories = JSON.parse(localStorage.getItem(meal.calKey)) || [];

  const totalCalories = storedCalories.reduce((acc, currVal) => {
    return parseInt(acc) + parseInt(currVal)
  }, 0);

  mealTypeCalories.textContent = `${totalCalories} cal`
  updateCaloriesToday();
}



const updateCaloriesToday = () => {
  let totalCaloriesToday = 0;

  for (const mealType in meals) {
    if (meals.hasOwnProperty(mealType)) {
      const meal = meals[mealType];
      const mealTypeCalories = meal.totalCal;
      const mealTypeCaloriesText = mealTypeCalories.textContent;
      const regex = /(\d+)/

      const caloriesMatch = mealTypeCaloriesText.match(regex);
      if (caloriesMatch && caloriesMatch[1]) {
        totalCaloriesToday += parseInt(caloriesMatch[1]);
      }
    }
  }

  if (caloriesDisplay) {
    caloriesDisplay.textContent = `${totalCaloriesToday} cal`
  }
}



// Attaching the same event listeners to 'addFoodBtn' & 'cancelBtn'
Object.entries(meals).forEach(([mealType, meal]) => {
  meal.addFoodBtn.addEventListener("click", () => {
    meal.foodForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");

    meal.foodInput.value = "";
    meal.foodCal.value = "";
  });

  meal.cancelBtn.addEventListener("click", () => {
    meal.foodForm.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  });

  meal.addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addFood(mealType);
    displayMealTypeTotalCalories(mealType);
    meal.foodForm.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  meal.clearBtn.addEventListener("click", () => {
    clearFood(mealType)
  })
});