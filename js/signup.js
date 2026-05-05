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
  clearErrors();
  let valid = true;

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;
  const role     = document.querySelector('input[name="is_admin"]:checked');

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

  if (!valid) {
    e.preventDefault();
  }
}