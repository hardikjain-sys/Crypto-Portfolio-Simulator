
let currentPrices = {};

let dataSave = [];




function fetchAPI(){
fetch('https://rest.coincap.io/v3/assets?limit=15', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer 160c831782162b122442aaf2a367f53f010dfaab2c69ffffe84a49de6cecc6ce'
  }
})
  .then(response => response.json())
  .then(data => {
    const cryptoData = data.data;
    let  x = [];
    for(var i=0; i<10;i++)
    {
      x[i] = {symbol: cryptoData[i].symbol, name: cryptoData[i].name, price: cryptoData[i].priceUsd};
    }

    for(var i = 0; i< 15; i++){
          currentPrices[cryptoData[i].symbol] = (cryptoData[i].priceUsd)*85;
    }
    buyDisplay(x);
    displayDashboard(JSON.parse(localStorage.getItem('allS') || '[]'));
    setpnl();
    dataSave = x;
  })
  .catch(error => {
    alert('Error fetching data:', error);
  });

}
fetchAPI();
fetch('https://rest.coincap.io/v3/assets?limit=15', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer e7cc86a0aac701643f28ab66906e4709e7e9883616d4c00518a121096b30ebc9'
  }
})
  .then(response => response.json())
  .then(data => {
    const cryptoData = data.data;
    let  x = [];
    let y = [];
    for(var i=0; i<10;i++)
    {
      x[i] = {symbol: cryptoData[i].symbol, name: cryptoData[i].name, price: cryptoData[i].priceUsd};
      
    }

    for(var i = 0; i< 15; i++){
          currentPrices[cryptoData[i].symbol] = cryptoData[i].priceUsd;
          y[i] = {symbol: ((cryptoData[i].symbol)+'').toUpperCase(), name: cryptoData[i].name, quantity: 0, price: 0};
    }

    console.log(y);
    if(localStorage.getItem('allS') == null){
    localStorage.setItem('allS', JSON.stringify(y));
    }

    buyDisplay(x);
    dataSave = x;
  })
  .catch(error => {
    alert('Error fetching data:', error);
  });



const holdings = [
  { symbol: 'btc', name: 'Bitcoin', quantity: 0.0023, price: 70 },
  { symbol: 'eth', name: 'Ethereum', quantity: 0.1, price: 10 },
];

function displayDashboard(holdings) {
  const container = document.getElementById('portfolio-dashboard');
  container.innerHTML = ''; 

  holdings.forEach(coin => {
    if(coin.quantity == 0) 
      return;
    const value = coin.quantity * coin.price;
    const priceToDisplay = currentPrices[coin.symbol.toUpperCase()] || 0;
    const row = document.createElement('div');
    row.className = 'coin-row';

    row.innerHTML = `
      <div><strong>${coin.name}</strong> (${coin.symbol.toUpperCase()})</div>
      <div>Qty: ${coin.quantity}</div>
      <div>Price: ₹${priceToDisplay.toLocaleString()}</div>
      <div>Value: ₹${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      <div><button class="sell-button" onclick="sellCoin('${coin.symbol}')">Sell</button></div>
    `;

    container.appendChild(row);
  });
}


function sellCoin(symbol) {
  const allHoldings = JSON.parse(localStorage.getItem('allS') || '[]');
  for (let i = 0; i < allHoldings.length; i++) {
    if (allHoldings[i].symbol === symbol) {
      if (allHoldings[i].quantity > 0) {
        allHoldings[i].quantity -= 1;
         localStorage.setItem('balance', parseInt(localStorage.getItem('balance')) + parseInt(allHoldings[i].price));
         
        if (localStorage.getItem('invested') != null) {
          localStorage.setItem('invested', parseInt(localStorage.getItem('invested')) - parseInt(allHoldings[i].price));
        } else {
          localStorage.setItem('invested', 0);
        }

        if (localStorage.getItem('realizedMoney') != null) {
          localStorage.setItem('realizedMoney', parseInt(localStorage.getItem('realizedMoney')) + parseInt(allHoldings[i].price));
        } else {
          localStorage.setItem('realizedMoney', parseInt(allHoldings[i].price));
        }
        document.getElementById('realizedMoney').innerHTML = 'Sold: ₹' + localStorage.getItem('realizedMoney');
        

        document.getElementById('balanceInfo').innerHTML = 'Current Balance: ₹' + localStorage.getItem('balance');

        if (allHoldings[i].quantity === 0) {
           localStorage.setItem('balance', parseInt(localStorage.getItem('balance')) + parseInt(allHoldings[i].price));
        document.getElementById('balanceInfo').innerHTML = 'Current Balance: ₹' + localStorage.getItem('balance');
          allHoldings[i].price = 0; 
        }

        
        break;
      } 
      else {
        return;
      }
    }
  }
  localStorage.setItem('allS', JSON.stringify(allHoldings));
  displayDashboard(allHoldings);

  setpnl();
}

function buyCoin(symbol, name, price)
{

    

    // console.log(symbol+'. '+ name+'. '+ price);
    const valueCheck = JSON.parse(localStorage.getItem('allS') || '[]');
    for(let i =0; i<15; i++){

        if(parseInt(localStorage.getItem('balance'))> parseInt(price)){
          console.log(localStorage.getItem('balance'));
          console.log(valueCheck[i].price);
        if(valueCheck[i].symbol == symbol){
            valueCheck[i].quantity = valueCheck[i].quantity+1;
            valueCheck[i].price = currentPrices[symbol];

            if(localStorage.getItem('invested')!=null)
            localStorage.setItem('invested',parseInt(localStorage.getItem('invested'))+parseInt(valueCheck[i].price));
          else{ localStorage.setItem('invested',parseInt(valueCheck[i].price));}
            parseInt(localStorage.setItem('balance',parseInt(localStorage.getItem('balance')) - parseInt(valueCheck[i].price)));
            document.getElementById('balanceInfo').innerHTML = 'Current Balance: ₹' + localStorage.getItem('balance');
            break;
        }
      }
      else{
        console.log(localStorage.getItem('balance'));
          console.log(valueCheck[i].price);
        alert('Insufficient balance to buy this coin.');
        break;
      }
    }
    localStorage.setItem('allS', JSON.stringify(valueCheck));
    displayDashboard(JSON.parse(localStorage.getItem('allS') || '[]'));
    setpnl();

}

const buyBtn = document.getElementById('buyCrypto');
const modalBuy = document.getElementById("buyModalID");
buyBtn.onclick = () => {
  fetchAPI();
  modalBuy.style.display = "block";

};
function closeBuy(){
  modalBuy.style.display = "none";
}
window.onclick = function(event) {
  if (event.target === modalBuy) {
    modalBuy.style.display = "none";
  }
};

function buyDisplay(prices) {
  const container = document.getElementById('contentBuyID');
  container.innerHTML = ''; 

  prices.forEach(coin => {
    const price = ((coin.price)*85).toFixed(2) || 0;
    const row = document.createElement('div');
    row.className = 'coin-rowBuy';

    row.innerHTML = `
    <span id="closeBtnBuy" onclick="closeBuy()" class="close">&times;</span>
      <div ><strong class='fontC'>${coin.name}</strong> (${coin.symbol.toUpperCase()})</div>
      <div class='fontC'>Price: ₹${price.toLocaleString()}</div>
      <div><button class="buy-button" onclick="buyCoin('${coin.symbol.toUpperCase()}', '${coin.name}', '${price}')">Buy</button></div>
    `;

    container.appendChild(row);
  });


 
}

function setpnl(){
  const allHoldings = JSON.parse(localStorage.getItem('allS') || '[]');
  let pnl = 0;
  let value = 0;
  let invested = 0;
  let realized = 0;

  if(localStorage.getItem('realizedMoney') != null){
         realized = parseInt(localStorage.getItem('realizedMoney'));
  document.getElementById('realizedMoney').innerHTML = 'Sold: ₹' + realized.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }


  
  for(let i = 0; i<allHoldings.length; i++){
    if(allHoldings[i].quantity > 0){
      value += allHoldings[i].quantity * currentPrices[allHoldings[i].symbol.toUpperCase()];
    }
  }
  console.log(value);
  invested = parseInt(localStorage.getItem('invested')) || 0;
  pnl = value - invested;
  localStorage.setItem('pnl', pnl);
  document.getElementById('pnl').innerHTML = 'P&L: ₹' + pnl.toLocaleString(undefined, { maximumFractionDigits: 2 });
  document.getElementById('invested').innerHTML = 'Invested: ₹' + invested.toLocaleString(undefined, { maximumFractionDigits: 2 });
  document.getElementById('value').innerHTML = 'Total Value: ₹' + value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if(pnl > 0){
    document.getElementById('pnl').style.color = 'green';
  }
  else if(pnl < 0){
    document.getElementById('pnl').style.color = 'red';
  }
  
}

