let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {id: Date.now(), name: 'Train', dueDate: '2025-04-22', dueTime: '08:00', status: 'pending', complexity: 3}
];

let recurringTasks = JSON.parse(localStorage.getItem('recurringTasks')) || [];
let dailyStats = JSON.parse(localStorage.getItem('dailyStats')) || {};

let isEditing = false;
let currentEditId = null;
let editingCardId = null;
let currentView = 'pending';
let today = new Date().toISOString().split('T')[0];

// For recurring task editing
let editingRecurringId = null;

// Initialize
let darkMode = localStorage.getItem('darkMode') === 'true';
updateDarkMode();
let showCountdown = localStorage.getItem('showCountdown') === 'true';
updateCountdownVisibility();
updateCountdown();
setInterval(updateCountdown, 1000);
generateRecurringTasks();
renderTodoList();

// Event listeners for new buttons
document.querySelector('.mode-toggle-button').addEventListener('click', toggleDarkMode);
document.querySelector('.view-deleted-tasks-button').addEventListener('click', () => toggleView('deleted'));
document.querySelector('.view-done-tasks-button').addEventListener('click', () => toggleView('completed'));
document.querySelector('.countdown-toggle-button').addEventListener('click', toggleCountdown);
document.querySelector('.track-progess-button').addEventListener('click', showProgressModal);
document.querySelector('.access-recurring-tasks-button').addEventListener('click', showRecurringTasksModal);

// New functions for recurring tasks
function generateRecurringTasks() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const dayOfWeek = now.getDay();
  
  recurringTasks.forEach(task => {
    const exists = todoList.some(t => 
      t.name === task.name && 
      t.dueDate === todayStr && 
      t.recurringTaskId === task.id
    );
    
    if (!exists) {
      let shouldAdd = false;
      
      if (task.frequency === 'daily') {
        shouldAdd = true;
      } 
      else if (task.frequency === 'specific') {
        shouldAdd = task.days.includes(dayOfWeek);
      }
      
      if (shouldAdd) {
        todoList.push({
          id: Date.now(),
          name: task.name,
          dueDate: todayStr,
          dueTime: task.time || '',
          complexity: task.complexity,
          status: 'pending',
          recurringTaskId: task.id
        });
      }
    }
  });
  
  saveToLocalStorage();
}

function showRecurringTasksModal() {
  const modal = document.querySelector('.recurring-tasks-modal');
  modal.classList.add('active');
  renderRecurringTasksList();
  
  // Reset form
  document.querySelector('.js-recurring-name').value = '';
  document.querySelector('.js-recurring-frequency').value = 'daily';
  document.querySelector('.js-recurring-time').value = '';
  document.querySelector('.js-recurring-complexity').value = '1';
  document.querySelectorAll('.days-of-week input').forEach(cb => cb.checked = false);
  document.querySelector('.days-of-week').classList.add('hidden');
  
  // Show add button, hide update button
  document.querySelector('.add-recurring-button').classList.remove('hidden');
  document.querySelector('.update-recurring-button').classList.add('hidden');
  
  // Event listener for frequency change
  document.querySelector('.js-recurring-frequency').addEventListener('change', (e) => {
    document.querySelector('.days-of-week').classList.toggle('hidden', e.target.value !== 'specific');
  });
  
  // Event listener for add button
  document.querySelector('.add-recurring-button').addEventListener('click', addRecurringTask);
  
  // Event listener for update button
  document.querySelector('.update-recurring-button').addEventListener('click', updateRecurringTask);
  
  // Close button
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.remove('active');
  });
}

function addRecurringTask() {
  const name = document.querySelector('.js-recurring-name').value;
  const frequency = document.querySelector('.js-recurring-frequency').value;
  const time = document.querySelector('.js-recurring-time').value;
  const complexity = parseInt(document.querySelector('.js-recurring-complexity').value);
  
  if (!name) {
    alert('Please enter a task name');
    return;
  }
  
  const days = [];
  if (frequency === 'specific') {
    document.querySelectorAll('.days-of-week input:checked').forEach(checkbox => {
      days.push(parseInt(checkbox.value));
    });
    
    if (days.length === 0) {
      alert('Please select at least one day');
      return;
    }
  }
  
  recurringTasks.push({
    id: Date.now(),
    name,
    frequency,
    time,
    days,
    complexity
  });
  
  saveRecurringTasks();
  renderRecurringTasksList();
  generateRecurringTasks();
  renderTodoList();
  
  // Clear form
  document.querySelector('.js-recurring-name').value = '';
  document.querySelector('.js-recurring-frequency').value = 'daily';
  document.querySelector('.js-recurring-time').value = '';
  document.querySelector('.js-recurring-complexity').value = '1';
  document.querySelectorAll('.days-of-week input').forEach(cb => cb.checked = false);
  document.querySelector('.days-of-week').classList.add('hidden');
}

function updateRecurringTask() {
  const name = document.querySelector('.js-recurring-name').value;
  const frequency = document.querySelector('.js-recurring-frequency').value;
  const time = document.querySelector('.js-recurring-time').value;
  const complexity = parseInt(document.querySelector('.js-recurring-complexity').value);
  
  if (!name) {
    alert('Please enter a task name');
    return;
  }
  
  const days = [];
  if (frequency === 'specific') {
    document.querySelectorAll('.days-of-week input:checked').forEach(checkbox => {
      days.push(parseInt(checkbox.value));
    });
    
    if (days.length === 0) {
      alert('Please select at least one day');
      return;
    }
  }
  
  const index = recurringTasks.findIndex(task => task.id === editingRecurringId);
  if (index !== -1) {
    recurringTasks[index] = {
      ...recurringTasks[index],
      name,
      frequency,
      time,
      days,
      complexity
    };
  }
  
  saveRecurringTasks();
  renderRecurringTasksList();
  generateRecurringTasks();
  renderTodoList();
  
  // Reset form and buttons
  document.querySelector('.js-recurring-name').value = '';
  document.querySelector('.js-recurring-frequency').value = 'daily';
  document.querySelector('.js-recurring-time').value = '';
  document.querySelector('.js-recurring-complexity').value = '1';
  document.querySelectorAll('.days-of-week input').forEach(cb => cb.checked = false);
  document.querySelector('.days-of-week').classList.add('hidden');
  document.querySelector('.add-recurring-button').classList.remove('hidden');
  document.querySelector('.update-recurring-button').classList.add('hidden');
  editingRecurringId = null;
}

function editRecurringTask(id) {
  const task = recurringTasks.find(t => t.id === id);
  if (!task) return;
  
  editingRecurringId = id;
  
  // Populate form
  document.querySelector('.js-recurring-name').value = task.name;
  document.querySelector('.js-recurring-frequency').value = task.frequency;
  document.querySelector('.js-recurring-time').value = task.time || '';
  document.querySelector('.js-recurring-complexity').value = task.complexity;
  
  // Handle days checkboxes
  document.querySelectorAll('.days-of-week input').forEach(cb => {
    cb.checked = task.days.includes(parseInt(cb.value));
  });
  
  // Show/hide days selector
  document.querySelector('.days-of-week').classList.toggle('hidden', task.frequency !== 'specific');
  
  // Show update button, hide add button
  document.querySelector('.add-recurring-button').classList.add('hidden');
  document.querySelector('.update-recurring-button').classList.remove('hidden');
}

function renderRecurringTasksList() {
  const container = document.querySelector('.recurring-tasks-list');
  let html = '';
  
  recurringTasks.forEach(task => {
    let frequencyText = '';
    if (task.frequency === 'daily') {
      frequencyText = 'Daily';
    } else if (task.frequency === 'specific') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      frequencyText = 'Every ' + task.days.map(d => dayNames[d]).join(', ');
    }
    
    const timeDisplay = task.time ? ` at ${task.time}` : '';
    
    html += `
      <div class="recurring-task-item" data-id="${task.id}">
        <div>
          <strong>${task.name}</strong> (Value: ${task.complexity})<br>
          <small>${frequencyText}${timeDisplay}</small>
        </div>
        <div class="recurring-task-actions">
          <button class="edit-recurring-button">Edit</button>
          <button class="delete-recurring-button">Delete</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || '<p>No recurring tasks</p>';
  
  // Add event listeners
  document.querySelectorAll('.delete-recurring-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.closest('.recurring-task-item').dataset.id);
      recurringTasks = recurringTasks.filter(task => task.id !== id);
      saveRecurringTasks();
      renderRecurringTasksList();
    });
  });
  
  document.querySelectorAll('.edit-recurring-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.closest('.recurring-task-item').dataset.id);
      editRecurringTask(id);
    });
  });
}

function saveRecurringTasks() {
  localStorage.setItem('recurringTasks', JSON.stringify(recurringTasks));
}

// New functions for progress tracking
function showProgressModal() {
  const modal = document.querySelector('.progress-modal');
  modal.classList.add('active');
  renderCalendar(new Date().getFullYear(), new Date().getMonth());
  
  // Close button
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.remove('active');
    document.querySelector('.day-details').classList.add('hidden');
  });
  
  // Month navigation
  document.querySelector('.prev-month').addEventListener('click', () => {
    const current = document.querySelector('.current-month-year').textContent;
    const [month, year] = current.split(' ');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = monthNames.indexOf(month);
    const date = new Date(year, currentMonth, 1);
    date.setMonth(date.getMonth() - 1);
    renderCalendar(date.getFullYear(), date.getMonth());
  });
  
  document.querySelector('.next-month').addEventListener('click', () => {
    const current = document.querySelector('.current-month-year').textContent;
    const [month, year] = current.split(' ');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = monthNames.indexOf(month);
    const date = new Date(year, currentMonth, 1);
    date.setMonth(date.getMonth() + 1);
    renderCalendar(date.getFullYear(), date.getMonth());
  });
}

function renderCalendar(year, month) {
  const container = document.querySelector('.calendar-grid');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Update header
  document.querySelector('.current-month-year').textContent = `${monthNames[month]} ${year}`;
  
  // Get first day and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create calendar grid
  let html = '';
  
  // Empty cells for days before the first
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-day"></div>`;
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const stats = dailyStats[dateStr];
    const hasData = !!stats;
    
    html += `
      <div class="calendar-day ${hasData ? 'has-data' : ''}" data-date="${dateStr}">
        <div class="day-number">${day}</div>
        ${hasData ? `
          <div class="day-stats">
            ${stats.completionRate}%<br>
            ${stats.currentPoints}/${stats.totalPoints} pts
          </div>
        ` : ''}
      </div>
    `;
  }
  
  container.innerHTML = html;
  
  // Add click event to each day
  document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
    day.addEventListener('click', () => {
      const date = day.dataset.date;
      const stats = dailyStats[date];
      
      if (stats) {
        document.querySelector('.detail-date').textContent = date;
        document.querySelector('.detail-completion').textContent = `${stats.completionRate}%`;
        document.querySelector('.detail-total-points').textContent = `${stats.totalPoints} pts`;
        document.querySelector('.detail-earned-points').textContent = `${stats.currentPoints} pts`;
        document.querySelector('.day-details').classList.remove('hidden');
      }
    });
  });
}

// Modified sorting function
function sortTasksByDateTime(tasks) {
  return tasks.sort((a, b) => {
    const aValue = getTaskDateTime(a);
    const bValue = getTaskDateTime(b);
    
    if (aValue === bValue) {
      // Same date/time, sort by complexity (higher first)
      return b.complexity - a.complexity;
    }
    return aValue - bValue;
  });
}

// Existing functions with updates for daily stats
function updateDailyStats() {
  const todaysTasks = todoList.filter(task => task.dueDate === today);
  
  const totalTasks = todaysTasks.length;
  const completedTasks = todaysTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = todaysTasks.filter(task => task.status === 'pending').length;
  const possibleScore = todaysTasks.reduce((sum, task) => sum + task.complexity, 0);
  const currentScore = todaysTasks
    .filter(task => task.status === 'completed')
    .reduce((sum, task) => sum + task.complexity, 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Save to daily stats
  dailyStats[today] = {
    totalTasks,
    completedTasks,
    pendingTasks,
    totalPoints: possibleScore,
    currentPoints: currentScore,
    completionRate: Math.round(completionRate)
  };
  
  localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
  
  // Update UI
  document.querySelector('.js-total-daily-tasks').textContent = totalTasks;
  document.querySelector('.js-pending-tasks').textContent = pendingTasks;
  document.querySelector('.js-completed-tasks').textContent = completedTasks;
  document.querySelector('.js-completion-rate').textContent = `${Math.round(completionRate)}%`;
  document.querySelector('.js-daily-score').textContent = `${possibleScore} pts`;
  document.querySelector('.js-current-score').textContent = `${currentScore} pts`;
}

// Existing functions remain with minor updates
function toggleView(view) {
  if (currentView === view) {
    currentView = 'pending';
  } else {
    currentView = view;
  }
  renderTodoList();
}

function toggleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  updateDarkMode();
}

function updateDarkMode() {
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.querySelector('.mode-toggle-icon').src = 'icons/sun.png';
    document.querySelector('.mode-toggle-button').title = 'Click to switch to light mode';
  } else {
    document.body.classList.remove('dark-mode');
    document.querySelector('.mode-toggle-icon').src = 'icons/moon.png';
    document.querySelector('.mode-toggle-button').title = 'Click to switch to dark mode';
  }
}

function toggleCountdown() {
  showCountdown = !showCountdown;
  localStorage.setItem('showCountdown', showCountdown);
  updateCountdownVisibility();
  
  const button = document.querySelector('.countdown-toggle-button');
  button.title = showCountdown 
    ? 'Click to hide countdown' 
    : 'Click to show countdown';
}

function updateCountdown() {
  if (!showCountdown) return;
  
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(24, 0, 0, 0);
  
  const diff = endOfDay - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  document.querySelector('.count-down').textContent = `${hours}h ${minutes}m`;
}

function updateCountdownVisibility() {
  const display = document.querySelector('.js-countdown-display');
  
  if (showCountdown) {
    display.classList.remove('hidden');
    updateCountdown();
  } else {
    display.classList.add('hidden');
  }
}

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function getTaskDateTime(task) {
  if (!task.dueDate) return Infinity;
  if (!task.dueTime) return new Date(task.dueDate).getTime() + 86400000;
  return new Date(`${task.dueDate} ${task.dueTime}`).getTime();
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
  
  let tasks = [];
  
  if (currentView === 'pending') {
    tasks = todoList.filter(task => task.status === 'pending');
  } 
  else if (currentView === 'completed') {
    tasks = todoList.filter(task => 
      task.status === 'completed' && task.completedDate === today
    );
  } 
  else if (currentView === 'deleted') {
    tasks = todoList.filter(task => 
      task.status === 'deleted' && task.deletedDate === today
    );
  }
  
  const sortedTasks = sortTasksByDateTime(tasks);
  
  let todoListHtml = '';

  sortedTasks.forEach((todoObject) => {
    const { id, name, dueDate, dueTime, complexity, recurringTaskId } = todoObject;
    
    const dateDisplay = dueDate || 'No date';
    const timeDisplay = dueTime || 'No time';
    
    const isEditingCard = editingCardId === id;
    
    let buttonsHtml = '';
    let recurringBadge = recurringTaskId ? '<span class="recurring-badge">(Recurring)</span>' : '';
    
    if (currentView === 'pending') {
      buttonsHtml = `
        <button class="edit-todo-button" data-id="${id}">Edit</button>
        <button class="delete-todo-button" data-id="${id}">Delete</button>
        <button class="done-todo-button" data-id="${id}">Done</button>
      `;
    } 
    else if (currentView === 'completed') {
      buttonsHtml = `
        <button class="restore-todo-button" data-id="${id}">Undone</button>
      `;
    } 
    else if (currentView === 'deleted') {
      buttonsHtml = `
        <button class="restore-todo-button" data-id="${id}">Restore</button>
        <button class="permanent-delete-button" data-id="${id}">Delete Forever</button>
      `;
    }
    
    const html = `
      <div class="task-card ${isEditingCard ? 'editing' : ''}" data-task-id="${id}">
        <div><strong>${name}</strong> (Value: ${complexity}) ${recurringBadge}</div>
        <div>${dateDisplay} at ${timeDisplay}</div>
        ${buttonsHtml}
      </div>
    `;
    todoListHtml += html;
  });

  document.querySelector('.js-todo-list').innerHTML = todoListHtml;

  const addButton = document.querySelector('.js-add-todo-button');
  if (addButton) addButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  document.querySelectorAll('.delete-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      if (task) {
        if (editingCardId === id) {
          resetEditMode();
        }
        task.status = 'deleted';
        task.deletedDate = today;
        saveToLocalStorage();
        renderTodoList();
        updateDailyStats();
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
        task.completedDate = today;
        saveToLocalStorage();
        renderTodoList();
        updateDailyStats();
      }
    });
  });
  
  document.querySelectorAll('.restore-todo-button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.dataset.id);
      const task = todoList.find(t => t.id === id);
      if (task) {
        task.status = 'pending';
        delete task.completedDate;
        delete task.deletedDate;
        saveToLocalStorage();
        renderTodoList();
        updateDailyStats();
      }
    });
  });
  
  document.querySelectorAll('.permanent-delete-button').forEach(button => {
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
        updateDailyStats();
      }
    });
  });
  
  updateDailyStats();
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

// Event Listeners
document.querySelector('.js-add-todo-button').addEventListener('click', addTodo);
document.querySelector('.js-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.querySelector('.day-details').classList.add('hidden');
  }
});

// Check for day changes to generate recurring tasks
setInterval(() => {
  const newToday = new Date().toISOString().split('T')[0];
  if (newToday !== today) {
    today = newToday;
    generateRecurringTasks();
    renderTodoList();
  }
}, 60000); // Check every minute