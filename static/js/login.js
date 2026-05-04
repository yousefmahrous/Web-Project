const API_URL = 'http://127.0.0.1:8000/api';

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.classList.add('error');

  const old = field.parentElement.querySelector('.error-msg');
  if (old) old.remove();

  const msg = document.createElement('span');
  msg.className = 'error-msg';
  msg.textContent = message;
  field.parentElement.appendChild(msg);
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.error-msg').forEach(el => el.remove());
}

function validate(e) {
  e.preventDefault();
  clearErrors();
  let valid = true;

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  
  if (!username) {
    showError('username', 'Username is required');
    valid = false;
  } else if (username.length < 3) {
    showError('username', 'At least 3 characters');
    valid = false;
  }

  if (!password) {
    showError('password', 'Password is required');
    valid = false;
  } else if (password.length < 8) {
    showError('password', 'At least 8 characters');
    valid = false;
  }

  if (!valid) return;

  fetch(`${API_URL}/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (!res.ok) throw res;
    return res.json();
  })
  .then(data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '../index.html';
  })
  .catch(async err => {
    const data = await err.json();
    showError('username', data.error || 'Login failed');
  });
}