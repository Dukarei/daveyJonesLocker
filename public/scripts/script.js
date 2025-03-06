import {sbar, ebar} from './util.js'

//init html element access variables
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.getElementById('login_form');
const registerForm = document.getElementById('register_form');

//updated to async/await syntax instead of promises, which GREATLY eases error message display
async function handleLoginSubmit(event) {
  event.preventDefault(); 
  const email = document.getElementById('user').value;
  const password = document.getElementById('pass').value;
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      window.location.href = '/userhome';
    } else {
      ebar("Incorrect Password(or internal server error)");
      console.error('Login failed');
    }
  } catch (error){ 
    console.error('Error logging in:', error);
  }
}
async function handleRegisterSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('email_register').value;
  const password = document.getElementById('pass_register').value;
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
	  sbar('User registered successfully');
	  container.classList.remove('active');
    } else {
	  ebar(data.message);
    }
  } catch (error) {
	console.error(error);
	ebar('Error registering user');
  }
}

//add/remove active toggles whether to cover up register form
loginForm.addEventListener('submit', handleLoginSubmit);
registerForm.addEventListener('submit', handleRegisterSubmit);
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});
loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});
