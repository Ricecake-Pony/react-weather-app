import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CurrentLocationTile from "../CurrentLocationTile";
import CityTile from "../CityTile";
import SearchBar from "../SearchBar";
import { WeatherContext } from "../../context/WeatherContext";
import { fetchCityWeather } from "../../utils/fetchCityWeather";
import "./sidebar.css";

export default function Sidebar() {
	const { cityWeatherData, setCityWeatherData, setActiveCity, geoWeatherData } =
		useContext(WeatherContext);

	const navigate = useNavigate();

	async function handleSearch(cityName) {
		console.log("handleSearch", cityName);
		const cityExists = cityWeatherData.some((city) => city.name === cityName);
		if (cityExists) {
			const matchedCity = cityWeatherData.find(
				(city) => city.location.name.toLowerCase() === cityName.toLowerCase()
			);
			setActiveCity(matchedCity);
			navigate(`/city/${cityName.toLowerCase()}`); 
			return;
		}
		try {
			const data = await fetchCityWeather({ cityName });
			setCityWeatherData([...cityWeatherData, data]); 
			setActiveCity(data); 
			navigate(`/city/${cityName.toLowerCase()}`); 
		} catch (err) {
			console.error("Error fetching city:", err);
		}
	}

	return (
		<div className="sidebar">
			<CurrentLocationTile
				onClick={() => {
					if (geoWeatherData) {
						setActiveCity(geoWeatherData);
						navigate("/");
					}
				}}
			/>
			<h2>WeatherNav</h2>
			<SearchBar onSearch={handleSearch} />
			<ul>
				<li>
					<NavLink to="/">Home</NavLink>
				</li>
				{cityWeatherData.length > 0 &&
					cityWeatherData.filter((city) => city?.location?.name).map((city, i) => (
						<li key={i}>
							<NavLink to={`/city/${city.location.name.toLowerCase()}`}>
								<CityTile
									cityWeatherData={city}
									onClick={() => {
										console.log("Setting active city to:", city);
										setActiveCity(city);
									}}
								/>
							</NavLink>
						</li>
					))}
			</ul>
			<nav>
				<ul>
					<li>
						<NavLink to="/city/London">London</NavLink>
					</li>
					<li>
						<NavLink to="/city/New York">New York</NavLink>
					</li>
				</ul>
			</nav>
		</div>
	);
}
