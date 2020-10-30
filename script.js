window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', handleSearchEvent);
}

const handleSearchEvent = () => {
  const currency = document.querySelector('#currency-input').value;
  const currencyUpperCased = currency.toUpperCase();
  cleanList();
  if (currencyUpperCased === 'BTC') {
    fetchCurrencyBTC(currencyUpperCased);
  } else if (currency === '') {
      showAlert('A moeda deve ser informada');
    } else {
      fetchCurrencyAwaitAsync(currencyUpperCased);
    // fetchCurrency(currencyUpperCased);    
  };
}

const showAlert = (message) => {
  window.alert(message);
}

const fetchCurrencyBTC = (currency) => {
  const endpoint = `https://api.coindesk.com/v1/bpi/currentprice.json`;  
    fetch(endpoint)
      .then((response) => response.json())
        .then((object) => {
      if (object.error) {
        throw new Error(object.error)
      } else {
        handleRatesBTC(object.bpi);
      }
    })
    .catch((error) => showAlert(error));
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
  const endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;

  try {
    const response = await fetch(endpoint);
    const object = await response.json();

    if (object.error) {
      throw new Error(object.error);
    } else {
      handleRates(object.rates);
    }
  } catch (error) {
    showAlert(error);
  }
}

const handleRatesBTC = (bpi) => {
  const ratesEntries = Object.entries(bpi);
  //console.log(ratesEntries);
  // ratesEntries.forEach(renderRate);
  ratesEntries.forEach((entry) => renderRateBTC(entry));
}

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates).sort();

  // ratesEntries.forEach(renderRate);
  ratesEntries.forEach((entry) => renderRate(entry));
}

const renderRateBTC = ([code, obj]) => {   
  const ul = document.querySelector('#currency-list');
  const li = document.createElement("li");
  console.log(obj.rate)
  li.innerHTML = `${code}: ${obj.rate}`;
  ul.appendChild(li);
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

const btClear = document.querySelector('#clear-button')
btClear.addEventListener('click', function() {
  const ul = document.querySelector('#currency-list');  
  const currency = document.querySelector('#currency-input');
  ul.innerHTML = '';
  currency.value = '';  
})

