window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', handleSearchEvent);
  const clearButton = document.querySelector('#clear-button');
  clearButton.addEventListener('click', cleanList);
}

const handleSearchEvent = () => {
  const currency = document.querySelector('#currency-input').value;
  const currencyUpperCased = currency.toUpperCase();

  cleanList();
  
  if (currency === '') {
    showAlert('A moeda deve ser informada');
  } else {
    // fetchCurrency(currencyUpperCased);
    fetchCurrencyAwaitAsync(currencyUpperCased);
  }
}

const showAlert = (message) => {
  window.alert(message);
}

// const fetchCurrency = (currency) => {
//   const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;

//   fetch(endpoint)
//     .then((response) => response.json())
//     .then((object) => {
//       if (object.error) {
//         throw new Error(object.error)
//       } else {
//         handleRates(object.rates);
//       }
//     })
//     .catch((error) => showAlert(error));
// }

const fetchCurrencyAwaitAsync = async (currency) => {
  let endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
  let isBTC = false;
  if (currency === 'BTC') {
    endpoint = `https://api.coindesk.com/v1/bpi/currentprice.json`;
    isBTC = true;
  }

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      isBTC? handleBtcRates(object.bpi) : handleRates(object.rates, currency);
    }
  } catch (error) {
    showAlert(error);
  }
}

const handleRates = (rates, currency) => {
  
  delete rates[currency];
  const ratesEntries = Object.entries(rates);
  ratesEntries
    .sort()
    .forEach(renderRate);
    
}

const handleBtcRates = (rates) => {
    const btcEntries = Object.entries(rates);
    btcEntries
      .sort()
      .map(([currency, ojbCurrency ]) => renderRate([currency, ojbCurrency.rate]));

} 

const renderRate = ([ currency, value ]) => {
  const ul = document.querySelector('#currency-list');
  const li = document.createElement("li");
  li.innerHTML = `${currency}: ${value}`
  ul.appendChild(li)
}

const cleanList = () => {
  const ul = document.querySelector('#currency-list');
  ul.innerHTML = '';
}


