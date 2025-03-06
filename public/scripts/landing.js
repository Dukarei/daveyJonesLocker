//TODO: add deletion operations, etc. 
//basic idea is handler functions will clean our input but typing this out it would seem a better idea to send to server, get a result, then decide whether or not to append a list+display succes, remove/edit list item and display success, or display an error
import {sbar, ebar} from './util.js'

const container = document.getElementById('cont');
const inBtn = document.getElementById('in_btn');
const reBtn = document.getElementById('re_btn');
const inForm = document.getElementById('in_form');
const reForm = document.getElementById('re_form');
const logoutForm = document.getElementById('logout-form');
const incomingIds = document.getElementById('incoming_IDs');
const receivedIds = document.getElementById('received_IDs');

const receivedArray = [];
const incomingArray = []; //runtime list of list-item IDs that is maintained in order to delete a given entry

function insertListItem(id, listId){
    let list = receivedIds;
    if(listId === 1)list = incomingIds;
    const li = document.createElement('li');
    li.textContent = `Value: ${id.value}`;
    let itemDiv = document.createElement('div');
    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete Value';
    deleteButton.classList.add('btn-link');
    deleteButton.style.backgroundColor = '#b30000';
    deleteButton.style.color = '#fff';
    itemDiv.style.display = 'none';
    itemDiv.appendChild(deleteButton);
    li.addEventListener('mouseover',()=>{
	itemDiv.style.display = 'block';
    });
    li.addEventListener('mouseout',()=>{
	itemDiv.style.display = 'none';
    });
    li.appendChild(itemDiv);
    list.appendChild(li);
    //instead make a delete function which takes id as a parameter which we create here
}
async function getUpdates(){
    try{
	console.log("Getting Updates");
	const response = await fetch('/getUpdates', {
	  method: 'GET',
	  headers: {
	    'Content-Type': 'application/json'
	  }} );
	const data = await response.json();
	incomingIds.innerHTML = '';
	data.incoming.forEach(id => {
	    insertListItem(id, 1);
	  });
	receivedIds.innerHTML = '';
	data.received.forEach(id => {
	    insertListItem(id, 0);
	  });
    }catch(error){
	console.error("Issue Getting Updates", error);
	ebar("Error Getting Updates From Server");
    }
}

//these checks are for moving new values to db and hopefully pre-sorting css elements before actually adding them in updateReceived()
//add checks to remove received stuff from incoming, etx
async function handleReceived(event) {
    event.preventDefault(); 
    const re_id = document.getElementById('received_ID').value;
    if (re_id === "") {
    console.error("Inserted value not a number");
    ebar("Inserted value not a number");
    return;
    } 
    try {
      const response = await fetch('/update_re', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify({ re_id })
      });
      const data = await response.json();
      if (!data.success) {
	ebar("ID already in table");
      }
      else{
	  insertListItem(re_id, 0);
      }
      //updateReceived(data); //actually update list?
    } catch (error) {
      console.error(error);
    }
    }
async function handleIncoming(event) {
  event.preventDefault(); 
  const in_id = document.getElementById('incoming_ID').value;
  if (in_id === "") {
    console.error("Inserted value not a number");
    ebar("Inserted value not a number");
    return;
  } else {
    console.log('new in_id:', { in_id });
    try {
      const response = await fetch('/update_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ in_id })
      });
      const data = await response.json();
      if (!data.success) {
        ebar("ID already in table");
      }
      else{
	insertListItem(in_id, 1)
      }
    } catch (error){
      console.error(error);
    }
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
logoutForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 
  try {
    const response = await fetch('/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
});

//updateLists();
getUpdates();
//setInterval(getUpdates, 20000);
