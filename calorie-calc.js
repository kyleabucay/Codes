const remainingCalories = document.getElementById("calories-remaining");
const overlay = document.querySelector(".background-overlay")

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
        calKey: "breakfastCalories"
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
        calKey: "lunchCalories"
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
        calKey: "dinnerCalories"
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
        calKey: "snacksCalories"
    }
}

// Removes trailing whitespaces, and removes any character that is NOT letters, hyphens, and spaces. Replace it with an empty string
const removeSpecialCharacters = (value) => {
    return value.trim().replace(/[^\p{L}\s\-]/gu, "");
}


//  Function block to dynamically add multiples items for each form
const addFood = (mealType) => {
    const meal = meals[mealType];       // Used [mealType] instead of dot notation since mealType is not a static, known property name. Bracket notation is for accessing dynamic, variable property names
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
        calories: foodCalories
    }

    // This retrieves existing arrays from localStorage or creates empty arrays if none exist
    // The || [] is the 'fallback' or the 'default value' and is essential for handling the first-time use case when no data has been saved yet, preventing errors and allowing your code to work correctly from the beginning.
    let storedFood = JSON.parse(localStorage.getItem(meal.nameKey)) || [];
    let storedCalories = JSON.parse(localStorage.getItem(meal.calKey)) || [];

    // Adds the item into the array
    storedFood.push(newFoodItem.name);
    storedCalories.push(newFoodItem.calories);

    // Converts it back into a JSON string
    localStorage.setItem(meal.nameKey, JSON.stringify(storedFood));
    localStorage.setItem(meal.calKey, JSON.stringify(storedCalories));
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

    meal.addBtn.addEventListener("click", () => {
        addFood(mealType);
    });
});

// Modal if there is an input and you want to click cancel