window.onload = () => {
  setupEventHandlers();
}

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  searchButton.addEventListener('click', handleSearchEvent);
  const clearButton = document.getElementById('clear-button')
  clearButton.addEventListener('click', handleClearEvent);

  const sortButton = document.getElementById('sort-list')
  sortButton.addEventListener('click', handleSortEvent);
}

const handleSortEvent = () => {
  const currencyList = document.querySelector('#currency-list')
  const currencyListSpread = [...currencyList.childNodes]
  const currencyListHandled = currencyListSpread.map(item => item.innerText.split(':'))

  const currencyEntries = currencyListHandled.sort()
  currencyList.innerHTML = ''

  currencyEntries.forEach(entry => renderRate(entry))
}

const handleClearEvent = () => {
  const currencyList = document.getElementById('currency-list')
  currencyList.innerHTML = ''
}

const handleBtcEvent = async (currency) => {
  const endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json'

  try {
    const data = await fetch(endpoint)
    const object = await data.json()
    const btcEntries = await Object.entries(object.bpi).map((element) => [element[0], element[1].rate])
    
    if (btcEntries.error) {
      throw new Error(btcEntries.error)
    } else {
      btcEntries.forEach(entry => renderRate(entry))
    }
  } catch (error) {
    showAlert(error)
  }

}

const handleSearchEvent = () => {
  const currency = document.querySelector('#currency-input').value;
  const currencyUpperCased = currency.toUpperCase();

  cleanList();
  
  if (currency === '') {
    showAlert('A moeda deve ser informada');
  } else if (currency === 'BTC') {
    handleBtcEvent(currency)
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

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates);

  // ratesEntries.forEach(renderRate);
  ratesEntries.forEach((entry) => renderRate(entry));
}

const renderRate = ([ currency, value ]) => {
  const ul = document.querySelector('#currency-list');
  const li = document.createElement("li");
  li.innerHTML = `${currency}: ${value}`
  li.className = 'currency-item'
  ul.appendChild(li)
}

const cleanList = () => {
  const ul = document.querySelector('#currency-list');
  ul.innerHTML = '';
}


