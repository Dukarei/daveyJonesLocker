const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const form = document.querySelector('form');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});



//stuff below is from registration form - will need to get the values after submission of that form/button, prob not the one below
/*
const email = document.getElementById("email").value;
const attempted_user = document.getElementById("user_register").value;
const attempted_pass = document.getElementById("pass_register").value;
*/


//TODO: check these against the database w/ pseudo code below, add separate checks fdr registration using the commented vars above
form.addEventListener('submit', (e) => {
    //stuff here is from the login form
    const username = document.getElementById("user").value;
    const passwd = document.getElementById("pass").value;
    let isValid = true;
  //if username already in DB, deny access
  //if username in DB does not match password, deny access
  //if user.hasEmail && gets 5 false attempts, lock account and send email to user
   
  
           
      
            alert(username + " " + passwd);
      

    if (!isValid) {
        e.preventDefault();
        alert('Invalid user/pass.');
    }
});