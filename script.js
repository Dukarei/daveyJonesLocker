const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

const loginForm = document.getElementById('login_form');
const registerForm = document.getElementById('register_form');




//TODO: check these against the database w/ pseudo code below, add separate checks fdr registration using the commented vars above
 //if username already in DB, deny access
  //if username in DB does not match password, deny access
  //if user.hasEmail && gets 5 false attempts, lock account and send email to user



isLoggedIn = false
function handleLoginSubmit(event) {
  event.preventDefault(); //prevent default form submission(page reload)
  const email = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  console.log('Login info:', { email, password });

  //send POST request to server w/ user data
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response)
  .then(data => console.log(data))
  .then(()=>window.location.href = '/userhome')
  .catch(error => console.error(error));
}

function handleRegisterSubmit(event) {
  event.preventDefault(); 
  const username = document.getElementById('user_register').value;
  const email = document.getElementById('email_register').value;
  const password = document.getElementById('pass_register').value;

  console.log('Register info:', { username, email, password });

  
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response)
  .then(data => console.log(data))
  .catch(error => console.error(error));
}




  loginForm.addEventListener('submit', handleLoginSubmit);
  registerForm.addEventListener('submit', handleRegisterSubmit);

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    
});