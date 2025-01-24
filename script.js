const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

const loginForm = document.getElementById('login_form');
const registerForm = document.getElementById('register_form');

//TODO: check these against the database w/ pseudo code below, add separate checks fdr registration using the commented vars above
 //if username already in DB, deny access
  //if username in DB does not match password, deny access
  //if user.hasEmail && gets 5 false attempts, lock account and send email to user


function handleLoginSubmit(event) {
    event.preventDefault(); 
  
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;
  
    console.log('Login info:', { username, password });
    //login stuff here
  }
  
  function handleRegisterSubmit(event) {
    event.preventDefault(); // no default form submission
  
    const username = document.getElementById('user_register').value;
    const email = document.getElementById('email_register').value;
    const password = document.getElementById('pass_register').value;
  
    console.log('Register info:', { username, email, password });
    //registration stuff here
  }

  loginForm.addEventListener('submit', handleLoginSubmit);
  registerForm.addEventListener('submit', handleRegisterSubmit);

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    
});