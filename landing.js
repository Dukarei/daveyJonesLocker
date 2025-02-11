//add stuff for inputting incoming as well as removing received, then POST stuff in backend/on buttons in html
//backend logic for removing received over 5
//add logic for only displaying so many nums
//add post thing like in login, but display elements will be client side updated adn loaded in/sent off on page
//refresh so it keeps up with user input stuff at all times  
//logout button 



const container = document.getElementById('cont');
const    inBtn = document.getElementById('in_btn');
const   reBtn = document.getElementById('re_btn');

const inForm = document.getElementById('in_form');
const reForm = document.getElementById('re_form');

const logoutForm = document.getElementById('logout-form');

logoutForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    fetch('/logout', {
        method: 'DELETE', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));

    // Redirect to the desired page
    window.location.href = '/';
});



isLoggedIn = false
//add checks to remove received stuff from incoming, etx
function handleReceived(event) {
  event.preventDefault(); //prevent default form submission(page reload)
  const re_id = document.getElementById('received_ID').value;
  const re_ids = document.getElementById('received_IDs');

  console.log('new re_id:', { re_id });

  const li = document.createElement('li');
  const numChildren = re_ids.children.length;
  if(numChildren > 18){
    console.log("removing prev. top item from display window")
    re_ids.removeChild(re_ids.children[0]);
  }
  li.textContent = re_id;
  re_ids.appendChild(li);

  //send POST request to server w/ user data
  fetch('/update_re', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ re_id })
  })
  .then(response => response)
  .then(data => console.log(data))
  .catch(error => console.error(error));
}

function handleIncoming(event) {
  event.preventDefault(); 
  const in_id  = document.getElementById('incoming_ID').value;
  const in_ids = document.getElementById('incoming_IDs');

  console.log('new in_id:', { in_id });

  const li = document.createElement('li');
  const numChildren = in_ids.children.length;
  if(numChildren > 18){
    console.log("removing prev. top item from display window")
    in_ids.removeChild(in_ids.children[0]);
  }
  li.textContent = in_id;
  in_ids.appendChild(li);
  
  fetch('/update_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({in_id })
  })
  .then(response => response)
  .then(data => console.log(data))
  .catch(error => console.error(error));
}




inForm.addEventListener('submit', handleIncoming);
reForm.addEventListener('submit', handleReceived);

reBtn.addEventListener('click', () => {
    container.classList.add('active');
});

   inBtn.addEventListener('click', () => {
    container.classList.remove('active');
    
});

function updateLists(){

}
updateLists();