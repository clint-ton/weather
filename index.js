const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const apiHandler = (() => {
  const API_KEY = "6d6d5ed366ac04677b05525e5a6b97ed";
  async function request(location) {
    const reqURL = `http:///api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
    const response = await fetch(reqURL, { mode: "cors" });
    return response.json();
  }

  const processResponse = (data) => {
    return {
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      location: `${data.name} ${data.sys.country}`,
      weather: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  };

  return {
    request,
    processResponse,
  };
})();

const DOMHandler = (() => {
  const buttonFunc = async () => {
    const input = document.querySelector(".input");
    const data = await apiHandler.request(input.value);
    refreshPage(apiHandlerprocessResponse(data));
    input.value = "";
  };

  document.querySelector(".button").addEventListener("click", buttonFunc);

  const refreshPage = (newData) => {
    document.getElementById("description").textContent = titleCase(
      newData.weather
    );
    document.getElementById("location").textContent = newData.location;
    document.getElementById(
      "icon"
    ).src = `http://openweathermap.org/img/wn/${newData.icon}@2x.png`;
    document.getElementById("temp").textContent = `${newData.temp}°C`;
  };

  return {
    refreshPage,
  };
})();

(async () => {
  const data = await apiHandler.request("Christchurch");
  DOMHandler.refreshPage(apiHandler.processResponse(data));
})();
