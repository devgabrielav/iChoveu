// Remova os comentários a medida que for implementando as funções
const token = import.meta.env.VITE_TOKEN

export const searchCities = async (term) => {
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${token}&q=${term}`);
  const data = await response.json();
    if (!data.length) alert('Nenhuma cidade encontrada');
    return data;
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
