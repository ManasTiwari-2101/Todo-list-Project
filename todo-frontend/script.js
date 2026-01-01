const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const logoutBtn = document.getElementById('logout-btn');

// function to update UI based on auth state
function updateUI() {
  const token = localStorage.getItem('token');

  if (token) {
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  fetchTasks();
}
 else {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
  }
}

// logout handler
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  updateUI();
});

// run on page load
updateUI();

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('https://todo-backend-obhg.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.error || 'Login failed';
      return;
    }

    // save token
    localStorage.setItem('token', data.token);

    // update UI
    updateUI();

  } catch (err) {
    loginError.textContent = 'Server error';
  }
});
const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  signupError.textContent = '';
  signupSuccess.textContent = '';

  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const res = await fetch('https://todo-backend-obhg.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      signupError.textContent = data.error || 'Signup failed';
      return;
    }

    signupSuccess.textContent = 'Signup successful! You can now login.';
    signupForm.reset();

  } catch (err) {
    signupError.textContent = 'Server error';
  }
});
const login = document.getElementById('login-form');
const signup = document.getElementById('signup-form');
const authTitle = document.getElementById('auth-title');
const toggleAuth = document.getElementById('toggle-auth');

function clearAuthMessages() {
  document.getElementById('login-error').textContent = '';
  document.getElementById('signup-error').textContent = '';
  document.getElementById('signup-success').textContent = '';
}

function showLogin() {
  clearAuthMessages();

  signup.style.display = 'none';
  login.style.display = 'flex';

  authTitle.textContent = 'Login';
  toggleAuth.textContent = "Don't have an account? Sign up";
}

function showSignup() {
  clearAuthMessages();

  login.style.display = 'none';
  signup.style.display = 'flex';

  authTitle.textContent = 'Sign Up';
  toggleAuth.textContent = 'Already have an account? Login';
}

// toggle click
toggleAuth.addEventListener('click', () => {
  if (login.style.display === 'flex') {
    showSignup();
  } else {
    showLogin();
  }
});

// IMPORTANT: initial render
showLogin();

const taskList = document.getElementById('task-list');

async function fetchTasks() {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const res = await fetch('https://todo-backend-obhg.onrender.com/tasks', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      // token invalid or expired
      localStorage.removeItem('token');
      updateUI();
      return;
    }

    const tasks = await res.json();
    renderTasks(tasks);

  } catch (err) {
    console.error('Failed to fetch tasks');
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  const emptyState = document.getElementById('empty-state');

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      toggleTask(task._id, checkbox.checked);
    });

    const span = document.createElement('span');
    span.textContent = task.title;
    if (task.completed) span.style.textDecoration = 'line-through';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task._id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}




const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  const token = localStorage.getItem('token');

  try {
    const res = await fetch('https://todo-backend-obhg.onrender.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title })
    });

    if (!res.ok) {
      console.error('Failed to add task');
      return;
    }

    taskInput.value = '';
    fetchTasks(); // refresh list

  } catch (err) {
    console.error('Error adding task');
  }
});

async function deleteTask(taskId) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`https://todo-backend-obhg.onrender.com/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      console.error('Failed to delete task');
      return;
    }

    fetchTasks(); // refresh list
  } catch (err) {
    console.error('Error deleting task');
  }
}

async function toggleTask(taskId, completed) {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`https://todo-backend-obhg.onrender.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ completed })
    });

    if (!res.ok) {
      console.error('Failed to update task');
      return;
    }

    fetchTasks(); // refresh UI
  } catch (err) {
    console.error('Error updating task');
  }
}
