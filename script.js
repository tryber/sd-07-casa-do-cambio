window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  const cleanButton = document.querySelector('.clean-button');
  searchButton.addEventListener('click', handleSearchEvent);
  cleanButton.addEventListener('click', cleanList);
}



const handleSearchEvent = () => {
  const currency = document.querySelector('#currency-input').value;
  const currencyUpperCased = currency.toUpperCase();

  cleanList();
  
  if (currency === '') {
    showAlert('A moeda deve ser informada');
  } else if (currencyUpperCased === 'BTC') {
    fetchCurrencyBTC(currencyUpperCased);
  } else {
    // fetchCurrency(currencyUpperCased);
    fetchCurrency(currencyUpperCased);
  }
}

const showAlert = (message) => {
  window.alert(message);
}

const fetchCurrency = (currency) => {
   const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;

   fetch(endpoint)
     .then((response) => response.json())
     .then((object) => {
       if (object.error) {
         throw new Error(object.error)
       } else {
         handleRates(object.rates);
       }
     })
     .catch((error) => showAlert(error));
}

const fetchCurrencyBTC = (currency) => {
  const endpoint = `https://api.coindesk.com/v1/bpi/currentprice.json`

  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => handleRatesBTC(object.bpi))
}
//const fetchCurrencyAwaitAsync = async (currency) => {
//  const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
//
//  try {
//    const response = await fetch(endpoint);
//    const object = await response.json();
//
//    if (object.error) {
//      throw new Error(object.error);
//    } else {
//      handleRates(object.rates);
//    }
//  } catch (error) {
//    showAlert(error);
//  }
//}

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates);
  const entriesSorted = ratesEntries.sort()

  // ratesEntries.forEach(renderRate);
  entriesSorted.forEach((entry) => renderRate(entry));
}

const handleRatesBTC = (rates) => {
  const ratesEntries = Object.entries(rates);
  const entriesSorted = ratesEntries.sort()

  entriesSorted.forEach((entry) => renderRateBTC(entry));
}

const renderRate = ([ currency, value ]) => {
  const ul = document.querySelector('#currency-list');
  const li = document.createElement("li");
  li.innerHTML = `${currency}: ${value}`
  ul.appendChild(li)
}

const renderRateBTC = ([ currency, value ]) => {
  const ul = document.querySelector('#currency-list');
  const li = document.createElement("li");
  li.innerHTML = `${currency}: ${value.rate}`
  ul.appendChild(li)
}

const cleanList = () => {
  const ul = document.querySelector('#currency-list');
  ul.innerHTML = '';
}

const sortList = () => {
  const ul = document.querySelector('#currency-list');

};


