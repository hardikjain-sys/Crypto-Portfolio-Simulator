


const clear = document.getElementById("clearAll");
const openBtn = document.getElementById("addBalance");
const modal = document.getElementById("myModal");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const textInput = document.getElementById("textInput");
const balanceInfo = document.getElementById('balanceInfo');
if(localStorage.getItem('balance') != null)
balanceInfo.innerHTML = 'Current Balance: ₹'+localStorage.getItem('balance');
openBtn.onclick = () => {
  modal.style.display = "block";
};

closeBtn.onclick = cancelBtn.onclick = () => {
  modal.style.display = "none";
};
clear.onclick = () => {
  localStorage.clear();
location.reload();
};
saveBtn.onclick = () => {
  modal.style.display = "none";
  

  const value = localStorage.getItem('balance');
if(parseInt(textInput.value) <= 500000000){
if (value === null) {
console.log(textInput.value);
  localStorage.setItem('balance',textInput.value+'');
  balanceInfo.innerHTML = 'Current Balance: ₹'+localStorage.getItem('balance');
} else {
  localStorage.setItem('balance',(parseInt(textInput.value) + parseInt(localStorage.getItem('balance'))));
  balanceInfo.innerHTML = 'Current Balance: ₹' + localStorage.getItem('balance');
}
}
else{
  alert('You cannot add more than 50Cr. to your balance.');  
}
};

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
