// Lesson 12: Todo list with for each method  
let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {name:'Train', dueDate:'2025-04-22'},
  {name:'Eat', dueDate:'2025-04-22'},
  {name: 'Sleep', dueDate:'2025-04-22'}
];

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Display todo list
renderTodoList();
 
// Function to display todo list on webpage 
function renderTodoList(){
  let todoListHtml = '';
  // Use forEach method to generate the html
  todoList.forEach(todoObject => {
    const { name, dueDate } = todoObject;
    const html = `
    <div>${name}</div>
    <div>${dueDate}</div>
    <button class="delete-todo-button js-delete-todo-button">
      Delete
    </button>
    `;
    todoListHtml += html;
  });  
  document.querySelector('.js-todo-list').innerHTML = todoListHtml;
  /* Add an event listener for all the delete buttons to check if a specific delete button is clicked */
  document.querySelectorAll('.js-delete-todo-button').forEach((deleteButton, index) => {
    deleteButton.addEventListener('click', () =>{
      todoList.splice(index,1); 
      saveToLocalStorage();
      renderTodoList();
    })
  });
}

// Add an event listener to check if the add button is clicked
document.querySelector('.js-add-todo-button').addEventListener('click', () => {
  addTodo();
});

//Function to add todo items 
function addTodo(){
  // Get inputs from html into js object
  const nameInputElement = document.querySelector('.js-name-input');
  const name = nameInputElement.value;
  const dueDateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dueDateInputElement.value;
  
  if (name.trim() === '') {
    alert('Please enter a todo name');
    return;
  }
  
  // Add item from textbox to array
  todoList.push({name, dueDate});
  // Save to localStorage
  saveToLocalStorage();
  
  // Clear input fields
  nameInputElement.value = '';
  dueDateInputElement.value = '';
  
  //Invoke function to display the current todo list on the webpage
  renderTodoList();
}