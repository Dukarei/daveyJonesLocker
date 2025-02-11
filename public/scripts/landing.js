//add stuff for inputting incoming as well as removing received, then POST stuff in backend/on buttons in html
//backend logic for removing received over 5
//add logic for only displaying so many nums
//add post thing like in login, but display elements will be client side updated adn loaded in/sent off on page
//refresh so it keeps up with user input stuff at all times  
//logout button 

//import { json } from "express";

//import { response } from "express";



const container = document.getElementById('cont');
const    inBtn = document.getElementById('in_btn');
const   reBtn = document.getElementById('re_btn');

const inForm = document.getElementById('in_form');
const reForm = document.getElementById('re_form');

const logoutForm = document.getElementById('logout-form');

function getUpdates() {
  console.log("Getting updates")
  fetch('/getUpdates')
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(error => console.error(error));
}
/*
function updateUI(data) {
  const incomingIds = document.getElementById('incoming_IDs');
  const receivedIds = document.getElementById('received_IDs');
  const numChildren = incomingIds.children.length;
  const numChildren2 = receivedIds.children.length;
  // Update the incoming and received tables with the new data
  incomingIds.innerHTML = '';
  data.incoming.forEach(id => {
    if(numChildren > 18){
      console.log("removing prev. top item from display window")
      incomingIds.removeChild(incomingIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = id;
    incomingIds.appendChild(li);
  });

  receivedIds.innerHTML = '';
  data.received.forEach(id => {
    if(numChildren2 > 18){
      console.log("removing prev. top item from display window")
      receivedIds.removeChild(receivedIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = id;
    receivedIds.appendChild(li);
  });
}*/
function updateUI(data) {
  const incomingIds = document.getElementById('incoming_IDs');
  const receivedIds = document.getElementById('received_IDs');
  const numChildren = incomingIds.children.length;
  const numChildren2 = receivedIds.children.length;

  incomingIds.innerHTML = '';
  data.incoming.forEach(id => {
    if(numChildren > 18){
      console.log("removing prev. top item from display window")
      incomingIds.removeChild(incomingIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${id.value}`;
    incomingIds.appendChild(li);
  });

  receivedIds.innerHTML = '';
  data.received.forEach(id => {
    if(numChildren2 > 18){
      console.log("removing prev. top item from display window")
      receivedIds.removeChild(receivedIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${id.value}`;
    receivedIds.appendChild(li);
  });
}




function updateReceived(response) {
  const re_id = response.re_id
  console.log(re_id)
  const receivedIds = document.getElementById('received_IDs');
  const numChildren = receivedIds.children.length;

  //receivedIds.innerHTML = '';
  
  while (numChildren > 18){
      console.log("removing prev. top item from display window")
      receivedIds.removeChild(receivedIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${re_id}`;
    receivedIds.appendChild(li);
  
}
function updateIncoming(response) {
  const in_id = response.in_id
  console.log(response)
  const incomingIds = document.getElementById('incoming_IDs');
  const numChildren = incomingIds.children.length;

  //incomingIds.innerHTML = '';
  
  while (numChildren > 18){
      console.log("removing prev. top item from display window")
      incomingIds.removeChild(incomingIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${in_id}`;
    incomingIds.appendChild(li);
  

}




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
    .catch((error) => console.error(error))
    

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
  //re_ids.appendChild(li);

  //send POST request to server w/ user data
  fetch('/update_re', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ re_id })
  })
  .then(response => response.json())
  .then(data => updateReceived(data))
  /*
  .catch(error => console.error(error));
  fetch('/re_id', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => updateReceived(data))
  .catch(error => console.error(error));
  */
}

function handleIncoming(event) {
  event.preventDefault(); 
  const in_id  = document.getElementById('incoming_ID').value;
  console.log('new in_id:', { in_id });
  fetch('/update_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => updateIncoming(data))
  .catch(error => console.error(error));
  /*
  fetch('/in_id', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({in_id })
  })
  .then(response => response.json())
  .then(data => updateIncoming(data))
  .catch(error => console.error(error));
  */
  
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
//updateLists();
getUpdates();
//setInterval(getUpdates, 20000);