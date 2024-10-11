document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task');
  const noTasksMessage = document.getElementById('no-tasks');
  const deleteTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date().getTime();
    tasks.forEach(task => {
      // Check if the task is completed and should be deleted
      if (task.completed && (now - task.timestamp) > deleteTime) {
        return; // Skip loading tasks that should be deleted
      }
      addTaskToUI(task.text, task.completed, task.timestamp);
    });
    tasks.length === 0 ? showNoTasksMessage() : hideNoTasksMessage();
  }

  // Save tasks to local storage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(task => {
      const text = task.querySelector('.task-text').innerText;
      const completed = task.querySelector('.task-checkbox').checked;
      const timestamp = task.getAttribute('data-timestamp') || new Date().getTime();
      tasks.push({ text, completed, timestamp });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    tasks.length === 0 ? showNoTasksMessage() : hideNoTasksMessage();
  }

  // Show "No tasks" message
  function showNoTasksMessage() {
    noTasksMessage.classList.remove('hidden');
  }

  // Hide "No tasks" message
  function hideNoTasksMessage() {
    noTasksMessage.classList.add('hidden');
  }

  // Add task to the UI
  function addTaskToUI(taskText, completed = false, timestamp = new Date().getTime()) {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-3 mt-2 bg-white  rounded-lg';
    li.setAttribute('data-timestamp', timestamp);

    // Task content (checkbox + text)
    const taskContent = document.createElement('div');
    taskContent.className = 'flex items-start  w-2/3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox mr-2';
    checkbox.checked = completed;

    const taskSpan = document.createElement('span');
    taskSpan.className = `task-text flex items-center ${completed ? 'line-through text-gray-400' : ''}`;
    taskSpan.innerText = taskText;

    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskSpan);

    // Checkbox to strike task when completed
    checkbox.addEventListener('change', function () {
      taskSpan.classList.toggle('line-through');
      taskSpan.classList.toggle('text-gray-400');
      li.setAttribute('data-timestamp', new Date().getTime());
      saveTasks();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'text-blue-500 ml-2';
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', function () {
      const newText = prompt('Edit your task:', taskSpan.innerText);
      if (newText !== null && newText.trim() !== '') {
        taskSpan.innerText = newText;
        saveTasks();
      }
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'text-red-500 ml-2';
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', function () {
      taskList.removeChild(li);
      saveTasks();
    });

    // Fixed width for buttons to keep them aligned
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex items-center space-x-2 w-1/3 justify-end';
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    li.appendChild(taskContent);
    li.appendChild(buttonContainer);

    taskList.appendChild(li);
    saveTasks();
  }

  // Add task on button click
  addTaskBtn.addEventListener('click', function () {
    const taskText = taskInput.value;
    if (taskText.trim()) {
      addTaskToUI(taskText);
      taskInput.value = '';
    }
  });

  // Load existing tasks on page load
  loadTasks();
});
