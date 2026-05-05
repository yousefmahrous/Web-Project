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

  const username = document.getElementById('username').value;
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

  if (!valid) {
    e.preventDefault();
  }
}