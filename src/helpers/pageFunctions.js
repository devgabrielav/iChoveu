import { searchCities, getWeatherByCity } from './weatherAPI';

const token = import.meta.env.VITE_TOKEN;
/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement(
    'span',
    'forecast-temp max',
    `${maxTemp}º`,
  );
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement(
    'span',
    'forecast-temp min',
    `${minTemp}º`,
  );
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export async function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo;
  const manyDays = 7;
  const newButton = document.createElement('button');
  newButton.setAttribute('id', 'seeForecast');
  newButton.innerText = 'Ver previsão';
  const forecastFetch = await fetch(`http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${token}&q=${url}&days=${manyDays}`);
  const data = await forecastFetch.json();
  const mappedData = data.forecast.forecastday;
  newButton.addEventListener('click', () => {
    const displayForecast = [];
    mappedData.forEach((days) => {
      displayForecast.push({
        date: days.date,
        maxTemp: days.day.maxtemp_c,
        minTemp: days.day.mintemp_c,
        condition: days.day.condition.text,
        icon: days.day.condition.icon,
      });
    });
    showForecast(displayForecast);
  });

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(newButton);
  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');

  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const cities = await searchCities(searchValue);
  const citiesFetched = cities.map((city) => city);
  Promise.all(citiesFetched).then((citiess) => {
    const lista = document.querySelector('#cities');
    citiess.map(async (city) => {
      const getWeather = await getWeatherByCity(city.url);
      const display = {
        name: city.name,
        country: city.country,
        temp: getWeather.temp,
        condition: getWeather.condition,
        icon: getWeather.icon,
        url: city.url,
      };
      lista.appendChild(await createCityElement(display));
    });
  });
}
