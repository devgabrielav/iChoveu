const token = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  const response = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${token}&q=${term}`);
  const data = await response.json();
  if (!data.length) alert('Nenhuma cidade encontrada');
  return data;
};

export const getWeatherByCity = async (cityURL) => {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?lang=pt&key=${token}&q=${cityURL}`);
  const data = await response.json();
  return {
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: `${data.current.condition.icon}`,
  };
};
