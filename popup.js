document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task');
  const noTasksMessage = document.getElementById('no-tasks');

  // Load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.length === 0 ? showNoTasksMessage() : hideNoTasksMessage();
    tasks.forEach(task => addTaskToUI(task.text, task.completed));
  }

  // Save tasks to local storage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(task => {
      const text = task.querySelector('.task-text').innerText;
      const completed = task.querySelector('.task-checkbox').checked;
      tasks.push({ text, completed });
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
  function addTaskToUI(taskText, completed = false) {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-2 mt-2 bg-white shadow-md rounded-lg';

    // Task content (checkbox + text)
    const taskContent = document.createElement('div');
    taskContent.className = 'flex items-center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox mr-2';
    checkbox.checked = completed;

    const taskSpan = document.createElement('span');
    taskSpan.className = `task-text ${completed ? 'line-through text-gray-400' : ''}`;
    taskSpan.innerText = taskText;

    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskSpan);

    // Checkbox to strike task when completed
    checkbox.addEventListener('change', function () {
      taskSpan.classList.toggle('line-through');
      taskSpan.classList.toggle('text-gray-400');
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

    // Append buttons and task content to list item
    li.appendChild(taskContent);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

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
