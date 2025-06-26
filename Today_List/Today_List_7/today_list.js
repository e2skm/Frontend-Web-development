let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {id: Date.now(), name: 'Train', dueDate: '2025-04-22', dueTime: '08:00', status: 'pending', complexity: 3}
];

let isEditing = false;
let currentEditId = null;
let editingCardId = null;

// Initialize countdown visibility from localStorage
let showCountdown = localStorage.getItem('showCountdown') === 'true';
updateCountdownVisibility();

// Initialize and update countdown
updateCountdown();
setInterval(updateCountdown, 60000); // Update every minute

// Toggle button event listener
document.querySelector('.js-countdown-toggle')?.addEventListener('click', () => {
  showCountdown = !showCountdown;
  localStorage.setItem('showCountdown', showCountdown);
  updateCountdownVisibility();
});

function updateCountdown() {
  if (!showCountdown) return;
  
  const now = new Date();
  const currentHour = now.getHours();
  const hoursLeft = 24 - currentHour;
  
  document.querySelector('.count-down').textContent = hoursLeft;
}

function updateCountdownVisibility() {
  const display = document.querySelector('.js-countdown-display');
  const button = document.querySelector('.js-countdown-toggle');
  
  if (showCountdown) {
    display.classList.remove('hidden');
    button.textContent = 'Hide Countdown';
    updateCountdown();
  } else {
    display.classList.add('hidden');
    button.textContent = 'Show Countdown';
  }
}

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function saveDailyScore(date, score) {
  let dailyScores = JSON.parse(localStorage.getItem('dailyScores') || '{}');
  dailyScores[date] = (dailyScores[date] || 0) + score;
  localStorage.setItem('dailyScores', JSON.stringify(dailyScores));
}

// Helper function to get task's datetime value for sorting
function getTaskDateTime(task) {
  if (!task.dueDate) return Infinity; // Tasks without date get highest value
  if (!task.dueTime) return new Date(task.dueDate).getTime() + 86400000; // Add 1 day to date-only tasks
  return new Date(`${task.dueDate} ${task.dueTime}`).getTime();
}

function sortTasksByDateTime(tasks) {
  return tasks.sort((a, b) => {
    const aValue = getTaskDateTime(a);
    const bValue = getTaskDateTime(b);
    return aValue - bValue;
  });
}

function resetEditMode() {
  isEditing = false;
  currentEditId = null;
  editingCardId = null;
  document.querySelector('.js-name-input').value = '';
  document.querySelector('.js-due-date-input').value = '';
  document.querySelector('.js-due-time-input').value = '';
  document.querySelector('.js-complexity-input').value = '1';
  document.querySelector('.js-add-todo-button').textContent = 'Add';
}

function renderTodoList() {
  if (!document.querySelector('.js-todo-list')) return;
  
  // Only show pending tasks (completed tasks will be hidden)
  const pendingTasks = todoList.filter(task => task.status === 'pending');
  const sortedTasks = sortTasksByDateTime(pendingTasks);
  
  let todoListHtml = '';

  sortedTasks.forEach((todoObject) => {
    const { id, name, dueDate, dueTime, complexity } = todoObject;
    
    // Handle missing date/time
    const dateDisplay = dueDate || 'No date';
    const timeDisplay = dueTime || 'No time';
    
    const isEditingCard = editingCardId === id;
    
    const html = `
      <div class="task-card ${isEditingCard ? 'editing' : ''}" data-task-id="${id}">
        <div><strong>${name}</strong> (Value: ${complexity})</div>
        <div>${dateDisplay} at ${timeDisplay}</div>
        <button class="edit-todo-button" data-id="${id}">Edit</button>
        <button class="delete-todo-button" data-id="${id}">Delete</button>
        <button class="done-todo-button" data-id="${id}">Done</button>
      </div>
    `;
    todoListHtml += html;
  });

  document.querySelector('.js-todo-list').innerHTML = todoListHtml;

  document.querySelectorAll('.delete-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const index = todoList.findIndex(t => t.id === id);
      if (index !== -1) {
        if (editingCardId === id) {
          resetEditMode();
        }
        todoList.splice(index, 1);
        saveToLocalStorage();
        renderTodoList();
      }
    });
  });

  document.querySelectorAll('.edit-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      populateEditForm(task);
    });
  });

  document.querySelectorAll('.done-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      if (task) {
        if (editingCardId === id) {
          resetEditMode();
        }
        task.status = 'completed';
        const today = new Date().toISOString().split('T')[0];
        saveDailyScore(today, task.complexity);
        saveToLocalStorage();
        renderTodoList(); // This will remove the task from view
        updateDailyStats(); // Update statistics
      }
    });
  });
  
  updateDailyStats(); // Update statistics after rendering
}

function populateEditForm(task) {
  document.querySelector('.js-name-input').value = task.name;
  document.querySelector('.js-due-date-input').value = task.dueDate;
  document.querySelector('.js-due-time-input').value = task.dueTime || '';
  document.querySelector('.js-complexity-input').value = task.complexity;

  isEditing = true;
  currentEditId = task.id;
  editingCardId = task.id;
  document.querySelector('.js-add-todo-button').textContent = 'Update';
  renderTodoList();
}

function addTodo() {
  const nameInput = document.querySelector('.js-name-input');
  const dueDateInput = document.querySelector('.js-due-date-input');
  const dueTimeInput = document.querySelector('.js-due-time-input');
  const complexityInput = document.querySelector('.js-complexity-input');

  const name = nameInput.value;
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value;
  const complexity = parseInt(complexityInput.value) || 1;

  if (name.trim() === '') {
    alert('Please enter a todo name');
    return;
  }

  if (isEditing) {
    const index = todoList.findIndex(t => t.id === currentEditId);
    if (index !== -1) {
      todoList[index] = {
        ...todoList[index],
        name,
        dueDate,
        dueTime,
        complexity
      };
    }
  } else {
    todoList.push({
      id: Date.now(),
      name,
      dueDate,
      dueTime,
      complexity,
      status: 'pending'
    });
  }

  saveToLocalStorage();
  resetEditMode();
  renderTodoList();
}

function updateDailyStats() {
  const today = new Date().toISOString().split('T')[0];
  
  // Only count tasks that are due today
  const todaysTasks = todoList.filter(task => task.dueDate === today);
  
  // Calculate statistics only for today's tasks
  const totalTasks = todaysTasks.length;
  const completedTasks = todaysTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const possibleScore = todaysTasks.reduce((sum, task) => sum + task.complexity, 0);
  const currentScore = todaysTasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + task.complexity, 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Update DOM
  document.querySelector('.js-total-daily-tasks').textContent = totalTasks;
  document.querySelector('.js-pending-tasks').textContent = pendingTasks;
  document.querySelector('.js-completed-tasks').textContent = completedTasks;
  document.querySelector('.js-completion-rate').textContent = `${completionRate.toFixed(0)}%`;
  document.querySelector('.js-daily-score').textContent = `${possibleScore} pts`;
  document.querySelector('.js-current-score').textContent = `${currentScore} pts`;
}

// Event Listeners
document.querySelector('.js-add-todo-button').addEventListener('click', addTodo);
document.querySelector('.js-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Initialize
renderTodoList();