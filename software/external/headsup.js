////////////////////////////////////////////////////////////////////////////////
// BEEFAX // EXTERNAL: HEADS UP                                               //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// External Def: IP Geolocation data.
var ipLocation = { lat: null, lon: null, rlat: 0, rlon: 0, gridx: 0, gridy: 0 };
var weatherUrls = { forecast: "", observation: "", observationBackup: "" };

// Class.
class ExternalHeadsUp {

	// Geolocation performer.
	static performGeolocation() {
		
		//TODO - Uncomment this and fix that dang CORS error.
		//getJSON("http://ip-api.com/json/", { fields: "lat,lon" }).then(ipData => {

		//TODO - Remove this hardcoded stuff.
		const ipData = {
			lat:  40.4444,
			lon: -86.9256
		}

			// Store lat & Long.
			ipLocation.lat = ipData.lat;
			ipLocation.lon = ipData.lon;
			ipLocation.rlat = Math.round(ipData.lat*100)/100;
			ipLocation.rlon = Math.round(ipData.lon*100)/100;

			// Search for grid position & URLs.
			getJSON(`https://api.weather.gov/points/${ipData.lat},${ipData.lon}`, {}).then(gridData => {

				// Store grid X & Y position.
				ipLocation.gridx = gridData.properties.gridX;
				ipLocation.gridy = gridData.properties.gridY;

				// Store forecast URL.
				weatherUrls.forecast = gridData.properties.forecast;

				// Get observation URL.
				getJSON(gridData.properties.observationStations, {}).then(stationData => {
					weatherUrls.observation = `${stationData.observationStations[0]}/observations/latest`;
					if (stationData.observationStations.length > 1) {
						weatherUrls.observationBackup = `${stationData.observationStations[1]}/observations/latest`;
					} else {
						weatherUrls.observationBackup = weatherUrls.observation;
					}
				});

			});
		
		//TODO - Uncomment this and fix that dang CORS error.
		//});
	}

	// Moon phase.
	// Modified from: https://gist.github.com/endel/dfe6bb2fbe679781948c#gistcomment-2811037
	static getMoonPhase(year, month, day) {

		const phases = ['New Moon', 'Waxing Crescent', 'Quarter Moon', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter Moon', 'Waning Crescent'];

		let c = 0; let e = 0; let jd = 0; let b = 0;
		if (month < 3) { year--; month += 12; }

		month++;
		c = 365.25 * year;
		e = 30.6 * month;
		jd = c + e + day - 694039.09; // jd is total days elapsed
		jd /= 29.5305882; // divide by the moon cycle
		b = parseInt(jd); // int(jd) -> b, take integer part of jd
		jd -= b; // subtract integer part to leave fractional part of original jd
		b = Math.round(jd * 8); // scale fraction from 0-8 and round

		if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
		return phases[b];

	}

	// Degrees C to F.
	static degCtoF(degC) {
		return Math.round((degC * 1.8) + 32);
	}

	// Kph to Mph.
	static KPHtoMPH(KPH) {
		return Math.round(KPH * 0.6213711922);
	}

	// Deg to Card.
	// Source: https://gist.github.com/basarat/4670200#gistcomment-2067650
	static DEGtoCARD(DEG) {
		if (typeof DEG === 'string') DEG = parseInt(DEG);
		if (DEG <= 0 || DEG > 360 || typeof DEG === 'undefined') return '☈';
		const arrows = { north: '↑ N', north_east: '↗ NE', east: '→ E', south_east: '↘ SE', south: '↓ S', south_west: '↙ SW', west: '← W', north_west: '↖ NW' };
		const directions = Object.keys(arrows);
		const degree = 360 / directions.length;
		DEG = DEG + degree / 2;
		for (let i = 0; i < directions.length; i++) {
			if (DEG >= (i * degree) && DEG < (i + 1) * degree) return arrows[directions[i]];
		}
		return arrows['north'];
	}

	// "Right now" write.
	static writeNow(title, temp, tempCode, wind, windCode, windDir, humid) {

		// Format data.
		title = "- " + (title==null ? "Unknown" : title) + " -";
		temp = (temp==null ? "..." : (tempCode=="wmoUnit:degC" ? ExternalHeadsUp.degCtoF(temp) : Math.round(temp))) + "degF";
		wind = (wind===null ? "..." : (windCode=="wmoUnit:km_h-1" ? ExternalHeadsUp.KPHtoMPH(wind) : Math.round(wind))) + "mph " + ExternalHeadsUp.DEGtoCARD(windDir);
		humid = (humid==null ? "..." : Math.round(humid)) + "% Humid";

		// Title.
		BufferInterface.writeString(title, 16, (consoleSize.columns-21)+Math.floor(((20-title.length)/2)));

		// Temperature.
		BufferInterface.writeString(temp, 17, (consoleSize.columns-21)+Math.floor(((20-temp.length)/2)));

		// Wind.
		BufferInterface.writeString(wind, 18, (consoleSize.columns-21)+Math.floor(((20-wind.length)/2)));

		// Humidity.
		BufferInterface.writeString(humid, 19, (consoleSize.columns-21)+Math.floor(((20-humid.length)/2)));

	}

	// Periodic update function.
	static periodicUpdate() {

		// Quit if incorrect menu.
		if (menuName != "headsup") return;

		// Retry geolocation if none found.
		if (location.lat == null && location.lon == null) ExternalHeadsUp.performGeolocation();

		// Display footer.
		BufferInterface.fillText(consoleSize.rows-2, 10, consoleSize.columns, 1, " ", 25);
		let footer = (!updateToggle ? `Location: ${ipLocation.rlat} ${ipLocation.rlon}` : "(Data from api.weather.gov)");
		BufferInterface.writeString(footer, consoleSize.rows-2, consoleSize.columns-1-footer.length);

		// Get forecast.
		getJSON(weatherUrls.forecast, {}).then(data => {

			// Quit if incorrect menu.
			if (menuName != "headsup") return;

			// Clear previous data.
			BufferInterface.fillText(3, 1, consoleSize.columns-2, 10, " ", 15);

			// Display forecast.
			let forecast = data.properties.periods;
			let forecastLength = (forecast.length<=5? forecast.length : 5);
			for (let index = 0; index < forecastLength; index++) {

				// Load data.
				let row = (index*2)+3;
				let data = forecast[index];
				let day = `[${data.name}]`;
				let temp = `${Math.round(data.temperature)}${data.temperatureUnit}`;
				let titles = data.shortForecast.split(" then ");
				let ticker = (titles.length>1 ? `(${updateToggle ? "2" : "1"}/2)`: "");
				let title = (titles.length>1&&updateToggle ? titles[1] : titles[0]).substr(0, consoleSize.columns-2);

				// Dots.
				for (let column=1; column<consoleSize.columns-2; column++) {
					BufferInterface.placeText(row, column, ".");
				}
				
				// Day.
				BufferInterface.writeString(day, row, 1);

				// Ticker.
				if (ticker.length>0) BufferInterface.writeString(ticker, row, day.length+2)

				// Temperature.
				BufferInterface.writeString(temp, row, consoleSize.columns-1-temp.length);

				// Weather title.
				BufferInterface.writeString(`${title}`, row+1, consoleSize.columns-1-title.length);

			}

		});

		// Get date & time.
		let now = new Date();
		let dotw = `[ ${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)} ]`;
		let date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: '2-digit' }).format(now);
		let time = new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(now);
		let moon = ExternalHeadsUp.getMoonPhase(now.getFullYear(), now.getMonth(), now.getDate());

		// Write date & time.
		BufferInterface.fillText(15, 1, 20, 6, " ", 21);
		BufferInterface.writeString(dotw, 15, Math.floor(((23-dotw.length)/2)));
		BufferInterface.writeString(date, 17, Math.floor(((23-date.length)/2)));
		BufferInterface.writeString(time, 18, Math.floor(((23-time.length)/2)));
		BufferInterface.writeString(moon, 19, Math.floor(((23-moon.length)/2)));

		// Get current conditions.
		getJSON(weatherUrls.observation, {}).then(data => {

			// Quit if incorrect menu.
			if (menuName != "headsup") return;

			// Clear previous data.
			BufferInterface.fillText(15, (consoleSize.columns-21), 20, 6, " ", 15);

			// Load data.
			data = data.properties;
			let title = data.textDescription;
			let temp = data.temperature.value;
			let tempCode = data.temperature.unitCode;
			let wind = data.windSpeed.value;
			let windCode = data.windSpeed.unitCode;
			let windDir = data.windDirection.value;
			let humid = data.relativeHumidity.value;

			// Load backup data.
			if (title==null || temp==null || wind==null || windDir==null || humid==null) { getJSON(weatherUrls.observationBackup, {}).then(backupData => {

				// Quit if incorrect menu.
				if (menuName != "headsup") return;

				// Perform load.
				backupData = backupData.properties;
				if (title==null) title = backupData.textDescription;
				if (temp==null) temp = backupData.temperature.value;
				if (wind==null) wind = backupData.windSpeed.value;
				if (windDir==null) windDir = backupData.windDirection.value;
				if (humid==null) humid = backupData.relativeHumidity.value;

				// Write data to screen.
				ExternalHeadsUp.writeNow(title, temp, tempCode, wind, windCode, windDir, humid);
			}); } else {
				ExternalHeadsUp.writeNow(title, temp, tempCode, wind, windCode, windDir, humid);
			}

		});
	}

}