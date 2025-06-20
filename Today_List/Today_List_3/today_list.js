let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {id: Date.now(), name: 'Train', dueDate: '2025-04-22', dueTime: '08:00', status: 'pending', complexity: 3}
];

let isEditing = false;
let currentEditId = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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

function sortTasksByDateTime(tasks) {
  return tasks.sort((a, b) => {
    const dateTimeA = new Date(`${a.dueDate} ${a.dueTime || '00:00'}`);
    const dateTimeB = new Date(`${b.dueDate} ${b.dueTime || '00:00'}`);
    return dateTimeA - dateTimeB;
  });
}

function renderTodoList() {
  if (!document.querySelector('.js-todo-list')) return;
  let todoListHtml = '';
  const sortedTasks = sortTasksByDateTime(todoList);

  sortedTasks.forEach((todoObject, index) => {
    const { id, name, dueDate, dueTime, complexity } = todoObject;
    const html = `
      <div class="task-card" data-task-id="${id}">
        <div><strong>${name}</strong> (Complexity: ${complexity})</div>
        <div>${dueDate} at ${dueTime || 'No time'}</div>
        <button class="edit-todo-button" data-id="${id}">Edit</button>
        <button class="delete-todo-button" data-index="${index}">Delete</button>
        <button class="done-todo-button" data-id="${id}">Done</button>
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

  document.querySelectorAll('.done-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      task.status = 'completed';
      const today = new Date().toISOString().split('T')[0];
      saveDailyScore(today, task.complexity);
      saveToLocalStorage();
      renderTodoList();
      renderStatusPage();
      renderCalendar();
      renderPSHistory();
    });
  });

  if (document.querySelector('.status-container')) {
    renderStatusPage();
  }
}

function populateEditForm(task) {
  document.querySelector('.js-name-input').value = task.name;
  document.querySelector('.js-due-date-input').value = task.dueDate;
  document.querySelector('.js-due-time-input').value = task.dueTime || '';
  document.querySelector('.js-complexity-input').value = task.complexity;

  isEditing = true;
  currentEditId = task.id;
  document.querySelector('.js-add-todo-button').textContent = 'Update';
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
    isEditing = false;
    currentEditId = null;
    document.querySelector('.js-add-todo-button').textContent = 'Add';
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
  nameInput.value = '';
  dueDateInput.value = '';
  dueTimeInput.value = '';
  complexityInput.value = '1';
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
  const sortedTasks = sortTasksByDateTime(tasks);

  sortedTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.dataset.taskId = task.id;
    taskElement.innerHTML = `
      <div><strong>${task.name}</strong> (Complexity: ${task.complexity})</div>
      <div>${task.dueDate} at ${task.dueTime || 'No time'}</div>
    `;
    container.appendChild(taskElement);
  });
}

function renderCalendar() {
  if (!document.getElementById('calendar-grid')) return;
  
  const calendarGrid = document.getElementById('calendar-grid');
  calendarGrid.innerHTML = '';
  
  // Set month header
  document.querySelector('.js-current-month').textContent = 
    new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Get first day of month
  const firstDay = new Date(currentYear, currentMonth, 1);
  // Get last day of month
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  // Create empty slots for days before first day
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendarGrid.appendChild(createCalendarDay(''));
  }
  
  // Create days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dailyScores = JSON.parse(localStorage.getItem('dailyScores') || '{}');
    const ps = dailyScores[dateStr] || 0;
    calendarGrid.appendChild(createCalendarDay(day, ps, dateStr));
  }
}

function createCalendarDay(day, ps = 0, dateStr = '') {
  const dayElement = document.createElement('div');
  dayElement.className = 'calendar-day';
  
  if (day) {
    dayElement.innerHTML = `
      <div class="calendar-date">${day}</div>
      ${ps ? `<div class="calendar-ps">${ps} PS</div>` : ''}
    `;
    
    if (dateStr === new Date().toISOString().split('T')[0]) {
      dayElement.style.border = '2px solid #4CAF50';
    }
  }
  
  return dayElement;
}

function renderPSHistory() {
  const container = document.querySelector('.js-ps-history');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Get last 7 days
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dailyScores = JSON.parse(localStorage.getItem('dailyScores') || '{}');
    const ps = dailyScores[dateStr] || 0;
    
    const dayCard = document.createElement('div');
    dayCard.className = 'ps-day-card';
    dayCard.innerHTML = `
      <div>${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
      <div>${date.getDate()}</div>
      <div><strong>${ps} PS</strong></div>
    `;
    
    container.appendChild(dayCard);
  }
}

// Event Listeners
document.querySelector('.js-add-todo-button').addEventListener('click', addTodo);
document.querySelector('.js-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
document.querySelector('.js-nav-to-index').addEventListener('click', () => window.location.href='index.html');
document.querySelector('.js-nav-to-track').addEventListener('click', () => window.location.href='track.html');

// Calendar navigation event listeners
document.querySelector('.js-prev-month')?.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

document.querySelector('.js-next-month')?.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Initialize
renderTodoList();
renderCalendar();
renderPSHistory();

// Object to record daily task data
const dailyTasksData = {
  totDailyTasks: 5,
  tasksPending: 3,
  tasksCompleted: 2
};
// Display daily task data on webpage
document.querySelector('.js-total-daily-tasks').innerHTML = `${dailyTasksData.totDailyTasks}`;
document.querySelector('.js-pending-tasks').innerHTML = `${dailyTasksData.tasksPending}`;
document.querySelector('.js-completed-tasks').innerHTML = `${dailyTasksData.tasksCompleted}`;
document.querySelector('.js-completion-rate').innerHTML = `${(dailyTasksData.tasksCompleted / dailyTasksData.totDailyTasks) * 100} %`;

// Object to record daily scores
const dailyScores = {
  possibleScore: 0,
  currentScore: 0
};
// Display daily scores on webpage
document.querySelector('.js-daily-score').innerHTML = `${dailyScores.possibleScore} pts`;
document.querySelector('.js-current-score').innerHTML = `${dailyScores.currentScore} pts`;