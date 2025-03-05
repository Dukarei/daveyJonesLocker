//init html element access variables
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const loginForm = document.getElementById('login_form');
const registerForm = document.getElementById('register_form');
let currentColor = 'linear-gradient(90deg, #b30000, #1a0000)'; //tracking present sbar color to hopefully fix error message issues

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

//status bar to display error/ success messages
function updateStatusBar(message, color) {
  const bar = document.getElementById("status_message");
  const mainBar = document.getElementById("status_container");
  const preButton = document.getElementById("temp_button");
  if (preButton) {
    mainBar.removeChild(preButton);
  }
  currentColor = color;
  bar.style.backgroundColor = color;
  bar.textContent = message;
  
  const button = document.createElement('button');
  button.textContent = "close";
  button.id = "temp_button";
  if (button) {
    mainBar.appendChild(button);
    button.addEventListener('click', () => {
      //bar.style.background = 'linear-gradient(90deg, #e2e2e2, #c9d6ff)';
      bar.textContent = "";
      mainBar.removeChild(button);
    });
  }
}
function sbar(message) {
  updateStatusBar(message, 'green');
}
function ebar(message) {
  updateStatusBar(message, 'red');
}
