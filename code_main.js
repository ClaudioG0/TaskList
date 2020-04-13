// Task Class: Represents a task
class Task {
  constructor (number, task, description) {
    this.number = number;
    this.task = task;
    this.description = description;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach((task) => UI.addTaskToList(task));
  }

  static addTaskToList(task) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${task.number}</td>
      <td>${task.task}</td>
      <td>${task.description}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteTask(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#number').value = '';
    document.querySelector('#task').value = '';
    document.querySelector('#description').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getTasks() {
    let tasks;
    if(localStorage.getItem('tasks') === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    return tasks;
  }

  static addTask(task) {
    const tasks = Store.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static removeTask(number) {
    const tasks = Store.getTasks();

    tasks.forEach((task, index) => {
      if(task.number === number) {
        tasks.splice(index, 1);
      }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayTasks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const number = document.querySelector('#number').value;
  const task = document.querySelector('#task').value;
  const description = document.querySelector('#description').value;

  // Validate
  if(number === '' || task === '' || description === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instatiate book
    const taske = new Task (number, task, description)

    // Add Book to UI
    UI.addTaskToList(taske);

    // Add book to store
    Store.addTask(taske);

    // Show success message
    UI.showAlert('Task Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteTask(e.target);

  // Remove book from store
  Store.removeTask(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Task Removed', 'success');
});