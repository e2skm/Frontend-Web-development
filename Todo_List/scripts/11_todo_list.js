// Lesson 11: Todo list 
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
  // Use for loop to generate the html
  for(let i = 0; i < todoList.length; i++){
    const todoObject = todoList[i];
    const { name, dueDate } = todoObject;
    const html = `
    <div>${name}</div>
    <div>${dueDate}</div>
    <button class="delete-todo-button" onclick="
      todoList.splice(${i},1); 
      saveToLocalStorage();
      renderTodoList();
    ">
      Delete
    </button>
    `;
    todoListHtml += html;
  }  
  document.querySelector('.js-todo-list').innerHTML = todoListHtml;
}

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