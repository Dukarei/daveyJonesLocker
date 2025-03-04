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
  event.preventDefault(); //prevent default form submission(page reload)
  const email = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  //console.log('Login info:', { email, password });

  //send POST request to server w/ user data
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
      console.log(response.body.success)
      if(response.body.success === "false") ebar("bad password probably");
  })
  .then(data => console.log(data))
  .then(()=>window.location.href = '/userhome')
  .catch(error => console.error(error));
}

/*
function handleRegisterSubmit(event) {
  event.preventDefault(); 
  //need to implement encryption here(RSA?)
  const email = document.getElementById('email_register').value;
  const password = document.getElementById('pass_register').value;
 // console.log('Register info:', { username, email, password });

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
      console.log(JSON.stringify(res.success))
      if(res.body.success === "false") ebar("user already registered/internal SQL error");
      else {
	    sbar("User registered successfully");
	    container.classList.remove('active'); //should pop up login menu as well
	    }
  })
  //.then(data => console.log(data))
  .catch(error => {
                    console.error(error)
                    ebar(error);
                  });
}*/
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



loginForm.addEventListener('submit', handleLoginSubmit);
registerForm.addEventListener('submit', handleRegisterSubmit);
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});
loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});
function sbar (message) { //function to turn top container into error message, should export but will instead copy/paste
  const prebutton = document.getElementById("temp_button");
  if(prebutton == null){
    const bar = document.getElementById("status_message");
    bar.style.backgroundColor = 'green';
    bar.textContent = message;   
    button = document.createElement('button');
    button.textContent = "close"; 
    button.id = "temp_button";
    if(button){
      main_bar = document.getElementById("status_container");
      main_bar.appendChild(button);
      button.addEventListener('click', ()=> {
        bar.style.background= 'linear-gradient(90deg, #e2e2e2, #c9d6ff)'; 
        bar.textContent = "";
        main_bar.removeChild(button);
      }); 
    }
  }
  }
function ebar (message) { //function to turn top container into error message, should export but will instead copy/paste
  const prebutton = document.getElementById("temp_button");
  if(prebutton == null){
    const bar = document.getElementById("status_message");
    bar.style.backgroundColor = 'red';
    bar.textContent = message;   
    button = document.createElement('button');
    button.textContent = "close"; 
    button.id = "temp_button";
    if(button){
      main_bar = document.getElementById("status_container");
      main_bar.appendChild(button);
      button.addEventListener('click', ()=> {
        bar.style.background= 'linear-gradient(90deg, #e2e2e2, #c9d6ff)'; 
        bar.textContent = "";
        main_bar.removeChild(button);
      }); 
    }
  }
  }
