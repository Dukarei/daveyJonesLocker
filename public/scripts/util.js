//like a single variable object that updates within this file for whatever view should be displayed to user, given they can only access one page at a time
let currentColor = 'linear-gradient(90deg, #b30000, #1a0000)'; 

//status bar to display error/ success messages
export function updateStatusBar(message, color) {
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
      if(color === 'green' && currentColor === 'green'){
	setTimeout(()=>{
	currentColor = 'linear-gradient(90deg, #b30000, #1a0000)';
	bar.style.backgroundColor = 'linear-gradient(90deg, #b30000, #1a0000)'; 
	bar.textContent = "";
	mainBar.removeChild(button);
	}, 1500);// = 1.5 seconds BEFORE code in block is executed
      }
    }
}
export function sbar(message) {
  updateStatusBar(message, 'green');
}
export function ebar(message) {
  updateStatusBar(message, 'red');
}
