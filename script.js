window.onload = () => {
  setupEventHandlers();
};

const setupEventHandlers = () => {
  const searchButton = document.querySelector('#search-button');
  const cleanButton = document.querySelector('#clean-button');
  searchButton.addEventListener('click', handleSearchEvent);
  cleanButton.addEventListener('click', cleanList);
};

const handleSearchEvent = () => {
  let currency = document.querySelector('#currency-input').value;
  currency = currency.toUpperCase();

  cleanList();

  currency === '' ? showAlert('A moeda deve ser informada') : getEndPoint(currency);
};

const getEndPoint = (currency) => {
  let endpoint;
  if (currency === 'BTC') {
    endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json';
  } else {
    endpoint = `https://api.ratesapi.io/api/latest?base=${currency}`;
  }
  fetchCurrencyAwaitAsync(endpoint);
};

const showAlert = (message) => window.alert(message);

const fetchCurrencyAwaitAsync = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    const object = await response.json();
    if (object.error) throw new Error(object.error);

    if (!object.rates) handleRatesBTC(object.bpi);

    if (object.rates) handleRates(object.rates);
  } catch (error) {
    showAlert(error);
  }
};

const handleRatesBTC = ({ EUR, GBP, USD }) => {
  let ratesValuesEUR = Object.values(EUR);
  let ratesValuesGBP = Object.values(GBP);
  let ratesValuesUSD = Object.values(USD);

  ratesValuesEUR = [
    ratesValuesEUR[0],
    ratesValuesEUR[4],
  ];

  ratesValuesGBP = [
    ratesValuesGBP[0],
    ratesValuesGBP[4],
  ];

  ratesValuesUSD = [
    ratesValuesUSD[0],
    ratesValuesUSD[4],
  ];

  const ratesEntries = [ratesValuesEUR, ratesValuesGBP, ratesValuesUSD];
  ratesEntries.sort();
  ratesEntries.forEach(renderRate);
};

const handleRates = (rates) => {
  const ratesEntries = Object.entries(rates);
  ratesEntries.sort();
  ratesEntries.forEach(renderRate);
};

const renderRate = ([ currency, value ]) => {
  const ul = document.querySelector('#currency-list');
  const li = document.createElement('li');
  li.innerHTML = `${currency}: ${value}`;
  ul.appendChild(li);
};

const cleanList = () => {
  const ul = document.querySelector('#currency-list');
  ul.innerHTML = '';
};
