window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', handleSearchEvent);

  const searchClearButton = document.querySelector('#clear-button');
  searchClearButton.addEventListener('click', cleanList);
}

const handleSearchEvent = () => {
  const currency = document.querySelector('#currency-input').value;
  const currencyUpperCased = currency.toUpperCase();

  cleanList();
  
  if (currency === '') {
    showAlert('A moeda deve ser informada');
  } else {
    fetchCurrencyAwaitAsync(currencyUpperCased);
  }
}

const showAlert = (message) => {
  window.alert(message);
}


const fetchCurrencyAwaitAsync = async (currency) => {
  let endpoint;

  if (currency === 'BTC') {
    endpoint = `https://api.coindesk.com/v1/bpi/currentprice.json`;
  } else {
    endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
  }

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      if (currency === 'BTC'){
        const objectBpi = object.bpi;
        const objectBTCKeys = Object.keys(objectBpi);
        const objectBTC = {};
        objectBTCKeys.forEach((key) => {
          objectBTC[objectBpi[key].code] = objectBpi[key].rate;
        });
        handleRates(objectBTC);
      } else {
        handleRates(object.rates);
      }
    }
  } catch (error) {
    showAlert(error);
  }
}

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates);
  ratesEntries.sort();
  ratesEntries.forEach((entry) => renderRate(entry));
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


