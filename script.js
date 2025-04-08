const addNewPlaceBtn = document.querySelector("#add-new-place-btn");
const addNewPlaceInput = document.querySelector("#add-new-place-input");


window.addEventListener("load", function () {
	whereAmI();
});

// RENDER WEATHER OF THE PLACE
const renderWeather = function (data) {
	const cardsBox = document.querySelector("#cards-box");
	const addNewPlaceBox = document.querySelector("#add-new-place-box");
	const html = `
    	<div class="weather-box">
            <p>${data.location.localtime}</p>
			<h2>${data.location.name}</h2>
		    <h3>${data.location.region}</h3>
			<p>${data.current.condition.text}</p>
            <img
                src="${data.current.condition.icon}"
                alt="Icon of the current weather"
            />
            <p>Current weather: ${data.current.temp_c}°C</p>
            <p>Feels like: ${data.current.feelslike_c}°C</p>
            <p>Humidity: ${data.current.humidity}</p>
            <i class="fa-regular fa-trash-can trash" style="color: #030303;"></i>
        </div>
    `;
	addNewPlaceBox.insertAdjacentHTML("beforebegin", html);
	cardsBox.style.opacity = 1;
};

// GET LOCATION OF THE USER
const whereAmI = async function () {
	try {
		const res = await fetch(
			"https://api.bigdatacloud.net/data/reverse-geocode-client"
		);
		if (!res.ok) throw new Error("Location not found");
		const data = await res.json();
		const resWeather = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=5956b683c3e14508ad6115835230311&q=${data.city}&aqi=no`
		);
		if (!resWeather.ok) throw new Error("Problem getting weather");
		const dataWeather = await resWeather.json();
		renderWeather(dataWeather);
	} catch (err) {
		console.error(err);
	}
};

// REMOVE PLACE FROM THE WEATHER APP
document.addEventListener("click", function (e) {
	const target = e.target.closest(".trash");
	if (!target) return;
	target.closest(".weather-box").remove();
});

// ADD NEW PLACE TO THE WEATHER APP
addNewPlaceBtn.addEventListener("click", addNewPlace);

addNewPlaceInput.addEventListener("keydown", (e) => 
	{
		if (e.key === "Enter") {
			addNewPlace();
		}
	}
)

async function addNewPlace() {
	try {
		const newPlace = addNewPlaceInput.value;
		if (!newPlace) throw new Error("Type in a city");
		const res = await fetch(
			`https://api.weatherapi.com/v1/current.json?key=5956b683c3e14508ad6115835230311&q=${newPlace}&aqi=no`
		);
		if (!res.ok) throw new Error("Location not found");
		const data = await res.json();
		renderWeather(data);
		addNewPlaceInput.value = "";
	} catch (err) {
		alert(err);
	}
}

