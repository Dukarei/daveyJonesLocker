
//import { json } from "express";
//import { response } from "express";
//TODO: add deletion operations, etc. 
import {sbar, ebar} from './util.js'


const container = document.getElementById('cont');
const inBtn = document.getElementById('in_btn');
const reBtn = document.getElementById('re_btn');
const MAX_NUM_CHILDREN = 12; //max num of list items(ids) to show per table

const inForm = document.getElementById('in_form');
const reForm = document.getElementById('re_form');

const logoutForm = document.getElementById('logout-form');
/*
function getUpdates() {
  console.log("Getting updates")
  fetch('/getUpdates')
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(error => console.error(error));
}*/
async function getUpdates(){
    try{
	console.log("Getting Updates");
	const response = await fetch('/getUpdates', {
	  method: 'GET',
	  headers: {
	    'Content-Type': 'application/json'
	  }} );
	const data = await response.json();
	updateUI(data);
    }catch(error){
	console.error("Issue Getting Updates");
	ebar("Error Getting Updates From Server");
    }
}

//fills out the incoming and received tables on website load
function updateUI(data) {
  const incomingIds = document.getElementById('incoming_IDs');
  const receivedIds = document.getElementById('received_IDs');
  const numIn = incomingIds.children.length;
  const numRe = receivedIds.children.length;

  incomingIds.innerHTML = '';
  data.incoming.forEach(id => {
    if(numIn > MAX_NUM_CHILDREN){
      console.log("removing prev. top item from display window")
      incomingIds.removeChild(incomingIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${id.value}`;
    incomingIds.appendChild(li);
    const li2 = document.createElement('li');
    incomingIds.appendChild(li2);
  });

  receivedIds.innerHTML = '';
  data.received.forEach(id => {
    if(numRe > MAX_NUM_CHILDREN){
      console.log("removing prev. top item from display window")
      receivedIds.removeChild(receivedIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${id.value}`;
    receivedIds.appendChild(li);
    const li2 = document.createElement('li');
    receivedIds.appendChild(li2);
  });
}



//functions made for updating a list after a single addition, still need to add deletion options
function updateReceived(response) {
  const re_id = response.re_id
  console.log(re_id)
  const receivedIds = document.getElementById('received_IDs');
  const numChildren = receivedIds.children.length;

  //receivedIds.innerHTML = '';
  //ensure that this check is working as intended and maintaining lowered child count on screen
  if (numChildren > MAX_NUM_CHILDREN){
      console.log("removing prev. top item from display window")
      receivedIds.removeChild(receivedIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${re_id}`;
    receivedIds.appendChild(li);
    const li2 = document.createElement('li');
    receivedIds.appendChild(li2);
  
}
function updateIncoming(response) {
  const in_id = response.in_id
  console.log(in_id)
  const incomingIds = document.getElementById('incoming_IDs');
  const numChildren = incomingIds.children.length;
  //incomingIds.innerHTML = '';
  
  if (numChildren > MAX_NUM_CHILDREN){
      console.log("removing prev. top item from display window")
      incomingIds.removeChild(incomingIds.children[0]);
    }
    const li = document.createElement('li');
    li.textContent = `Value: ${in_id}`;
    incomingIds.appendChild(li);
    const li2 = document.createElement('li');
    incomingIds.appendChild(li2);
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



//these checks are for moving new values to db and hopefully pre-sorting css elements before actually adding them in updateReceived()
//add checks to remove received stuff from incoming, etx
function handleReceived(event) {
  event.preventDefault(); //prevent default form submission(page reload)
  const re_id = document.getElementById('received_ID').value;
  const re_ids = document.getElementById('received_IDs');
  
  if(isNaN(re_id)|| re_id === ""){
    console.error("inserted value not a number");
    ebar("inserted value not a number"); 
    return; //hopefully prevent form submission
  }else {
  console.log('new re_id:', { re_id });
  const li = document.createElement('li');
  const numChildren = re_ids.children.length;
  if(numChildren > MAX_NUM_CHILDREN){
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
  .then(response =>{
      if(!response.body.success) ebar("ID already in table");
  })
  .then(data => updateReceived(data)) //update received with data acquired from this function
  
  .catch(error => console.error(error));
}
}

function handleIncoming(event) {
  event.preventDefault(); 
  const in_id  = document.getElementById('incoming_ID').value;
  if(isNaN(in_id) || in_id === ""){
    console.error("inserted value not a number");
    ebar("inserted value not a number"); 
    return; //hopefully precent form submission
  }
  else{
  console.log('new in_id:', { in_id });
  fetch('/update_in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
      if(!response.body.success) ebar("ID already in table");
  })
  .then(data => updateIncoming(data)) //update incoming with data acquired from this function
  .catch(error => console.error(error))
}
}




inForm.addEventListener('submit', handleIncoming);
reForm.addEventListener('submit', handleReceived);


reBtn.addEventListener('click', () => {
    container.classList.add('active');
});

   inBtn.addEventListener('click', () => {
    container.classList.remove('active');
    
});
//updateLists();
getUpdates();
//setInterval(getUpdates, 20000);
