const API_URL = '/api';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

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
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const role = document.querySelector('input[name="is_admin"]:checked');

  if (!username) {
    showError('username', 'Username is required');
    valid = false;
  } else if (username.length < 3) {
    showError('username', 'At least 3 characters');
    valid = false;
  }

  if (!email) {
    showError('email', 'Email is required');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Enter a valid email');
    valid = false;
  }

  if (!password) {
    showError('password', 'Password is required');
    valid = false;
  } else if (password.length < 8) {
    showError('password', 'At least 8 characters');
    valid = false;
  } else if (!/[A-Z]/.test(password)) {
    showError('password', 'Must contain an uppercase letter');
    valid = false;
  } else if (!/[0-9]/.test(password)) {
    showError('password', 'Must contain a number');
    valid = false;
  }

  if (!confirm) {
    showError('confirm', 'Please confirm your password');
    valid = false;
  } else if (confirm !== password) {
    showError('confirm', 'Passwords do not match');
    valid = false;
  }

  if (!role) {
    const radioDiv = document.querySelector('.radio');
    const old = radioDiv.querySelector('.error-msg');
    if (old) old.remove();
    const msg = document.createElement('span');
    msg.className = 'error-msg';
    msg.textContent = 'Please select Admin or User';
    radioDiv.appendChild(msg);
    valid = false;
  }

  if (!valid) return;

  const is_admin = role ? role.value === 'Admin' : false;

fetch(`${API_URL}/accounts/api-signup/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password,
      confirm_password: confirm,
      is_admin
    })
  })
  .then(async res => {
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Server returned non-JSON:', text.substring(0, 500));
      throw new Error(`Server error ${res.status}: ${res.statusText}`);
    }

    if (!res.ok) {
      const msg = data.error || data.detail || Object.values(data).flat().join(', ') || 'Signup failed';
      throw new Error(msg);
    }
    return data;
  })
  .then(data => {
    console.log('Signup response:', data);

    const token = data.token || data.access;
    if (!token) {
      throw new Error('No token received from server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('Token saved:', token);

    window.location.href = '/';
  })
  .catch(err => {
    console.error('Signup error:', err);
    showError('username', err.message || 'Signup failed');
  });
}