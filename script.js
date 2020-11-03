window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', handleSearchEvent);

  const bitcoinButton = document.querySelector('#bitcoin-button');
  bitcoinButton.addEventListener('click', fetchBitcoin);

  const clearButton = document.querySelector('#clear-button');
  clearButton.addEventListener('click', cleanList)
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

const orderCurrency = (currencyObj, currency) => {
  const orderedCurrency = {};
  Object.keys(currencyObj).sort().forEach(key => {
    if (key !== currency) {
      orderedCurrency[key] = currencyObj[key];
    }
  });
  return orderedCurrency;
}

const fetchCurrencyAwaitAsync = async (currency) => {
  const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleRates(orderCurrency(object.rates, currency));
    }
  } catch (error) {
    showAlert(error);
  }
}

const fetchBitcoin = async () => {
  const endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json';

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
    throw new Error(object.error);
    } else {
      cleanList();
      handleBitcoins(object.bpi);
    }
  } catch (error) {
    showAlert(error)
  }
}

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates);

  // ratesEntries.forEach(renderRate);
  ratesEntries.forEach((entry) => renderRate(entry));
}

const handleBitcoins = (bicoinsRates) => {
  Object.entries(bicoinsRates).forEach(entry => renderRate([ entry[1].code, entry[1].rate ]));
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


