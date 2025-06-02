let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {id: Date.now(), name: 'Train', dueDate: '2025-04-22', dueTime: '08:00', status: 'pending'}
];

let isEditing = false;
let currentEditId = null;

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Helper function to sort tasks by date and time
function sortTasksByDateTime(tasks) {
  return tasks.sort((a, b) => {
    // Combine date and time for comparison
    const dateTimeA = new Date(`${a.dueDate} ${a.dueTime || '00:00'}`);
    const dateTimeB = new Date(`${b.dueDate} ${b.dueTime || '00:00'}`);
    return dateTimeA - dateTimeB;
  });
}

function renderTodoList() {
  if (!document.querySelector('.js-todo-list')) return;
  
  let todoListHtml = '';
  
  // Sort tasks before rendering
  const sortedTasks = sortTasksByDateTime(todoList);
  
  sortedTasks.forEach((todoObject, index) => {
    const { id, name, dueDate, dueTime } = todoObject;
    const html = `
      <div class="task-card" draggable="true" data-task-id="${id}">
        <div><strong>${name}</strong></div>
        <div>${dueDate} at ${dueTime || 'No time'}</div>
        <button class="edit-todo-button" data-id="${id}">
          Edit
        </button>
        <button class="delete-todo-button" data-index="${index}">
          Delete
        </button>
      </div>
    `;
    todoListHtml += html;
  });
  
  document.querySelector('.js-todo-list').innerHTML = todoListHtml;
  
  document.querySelectorAll('.delete-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      todoList.splice(index, 1);
      saveToLocalStorage();
      renderTodoList();
      renderStatusPage();
    });
  });
  
  document.querySelectorAll('.edit-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      populateEditForm(task);
    });
  });
  
  document.querySelectorAll('.task-card').forEach(task => {
    task.addEventListener('dragstart', dragStart);
  });
  
  if (document.querySelector('.status-container')) {
    renderStatusPage();
  }
}

function populateEditForm(task) {
  document.querySelector('.js-name-input').value = task.name;
  document.querySelector('.js-due-date-input').value = task.dueDate;
  document.querySelector('.js-due-time-input').value = task.dueTime || '';
  
  isEditing = true;
  currentEditId = task.id;
  document.querySelector('.js-add-todo-button').textContent = 'Update';
}

function addTodo() {
  const nameInputElement = document.querySelector('.js-name-input');
  const name = nameInputElement.value;
  const dueDateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dueDateInputElement.value;
  const dueTimeInputElement = document.querySelector('.js-due-time-input');
  const dueTime = dueTimeInputElement.value;
  
  if (name.trim() === '') {
    alert('Please enter a todo name');
    return;
  }
  
  if (isEditing) {
    const index = todoList.findIndex(t => t.id === currentEditId);
    if (index !== -1) {
      todoList[index] = {
        id: currentEditId,
        name,
        dueDate,
        dueTime,
        status: todoList[index].status
      };
    }
    isEditing = false;
    currentEditId = null;
    document.querySelector('.js-add-todo-button').textContent = 'Add';
  } else {
    todoList.push({
      id: Date.now(),
      name,
      dueDate,
      dueTime,
      status: 'pending'
    });
  }
  
  saveToLocalStorage();
  nameInputElement.value = '';
  dueDateInputElement.value = '';
  dueTimeInputElement.value = '';
  renderTodoList();
}

function renderStatusPage() {
  if (!document.querySelector('.status-container')) return;
  
  const pendingTasks = todoList.filter(task => task.status === 'pending');
  const inProgressTasks = todoList.filter(task => task.status === 'in-progress');
  const completedTasks = todoList.filter(task => task.status === 'completed');
  
  renderTaskList(pendingTasks, 'pending-tasks');
  renderTaskList(inProgressTasks, 'in-progress-tasks');
  renderTaskList(completedTasks, 'completed-tasks');
}

function renderTaskList(tasks, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  // Sort tasks before rendering
  const sortedTasks = sortTasksByDateTime(tasks);
  
  sortedTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;
    taskElement.innerHTML = `
      <div><strong>${task.name}</strong></div>
      <div>${task.dueDate} at ${task.dueTime || 'No time'}</div>
    `;
    taskElement.addEventListener('dragstart', dragStart);
    container.appendChild(taskElement);
  });
}

// Drag and Drop functions
function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  const newStatus = event.target.closest('.status-column').id;
  
  // Update task status
  const taskIndex = todoList.findIndex(t => t.id === parseInt(taskId));
  if (taskIndex !== -1) {
    todoList[taskIndex].status = newStatus;
    saveToLocalStorage();
    renderStatusPage();
  }
}

// Event Listeners
document.querySelector('.js-add-todo-button').addEventListener('click', addTodo);
document.querySelector('.js-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
document.querySelector('.js-nav-to-index').addEventListener('click', () => window.location.href='index.html');
document.querySelector('.js-nav-to-track').addEventListener('click', () => window.location.href='track.html');

// Initialize
renderTodoList();
