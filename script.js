
let is24Hour = false;
let isLightTheme = false;

function updateClock() {
    const now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    let secs = now.getSeconds();

    let ampm = "";
    if (!is24Hour) {
        ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12 || 12;
    }

    const H = hrs.toString().padStart(2, "0");
    const M = mins.toString().padStart(2, "0");
    const S = secs.toString().padStart(2, "0");

    document.getElementById("time").innerText =
        is24Hour ? `${H}:${M}:${S}` : `${H}:${M}:${S} ${ampm}`;

    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    document.getElementById("date").innerText = now.toLocaleDateString("en-US", options);

    let greeting = "";
    const hourReal = now.getHours();
    if (hourReal < 12) greeting = "Good Morning ☀️";
    else if (hourReal < 17) greeting = "Good Afternoon 🌤️";
    else if (hourReal < 21) greeting = "Good Evening 🌆";
    else greeting = "Good Night 🌙";

    document.getElementById("greeting").innerText = greeting;

    updateTimeBackground(hourReal);
}

setInterval(updateClock, 1000);
updateClock();

function updateTimeBackground(hour) {
    document.body.classList.remove("morning-bg","afternoon-bg","evening-bg","night-bg");

    if (!isLightTheme) {
        if (hour < 12) document.body.classList.add("morning-bg");
        else if (hour < 17) document.body.classList.add("afternoon-bg");
        else if (hour < 21) document.body.classList.add("evening-bg");
        else document.body.classList.add("night-bg");
    }
}

document.getElementById("toggleFormat").onclick = () => {
    is24Hour = !is24Hour;
    document.getElementById("toggleFormat").innerText =
        is24Hour ? "Switch to 12-Hour" : "Switch to 24-Hour";
};


document.getElementById("toggleTheme").onclick = () => {

    isLightTheme = !isLightTheme;

    if (isLightTheme) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");

        document.getElementById("toggleTheme").innerText = "Switch to Dark Mode";
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");

        document.getElementById("toggleTheme").innerText = "Switch to Light Mode";
    }
};

document.getElementById("fullScreenBtn").onclick = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};


document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelector(".tab.active").classList.remove("active");
        tab.classList.add("active");

        document.querySelector(".section.active").classList.remove("active");
        document.getElementById(tab.dataset.target).classList.add("active");
    });
});


let alarms = [];

document.getElementById("setAlarmBtn").onclick = () => {
    const time = document.getElementById("alarmTime").value;
    if (!time) return alert("Select a valid time!");

    alarms.push(time);
    renderAlarms();
};

function renderAlarms() {
    const alarmList = document.getElementById("alarmList");
    alarmList.innerHTML = "";

    alarms.forEach((time, index) => {
        const li = document.createElement("li");
        li.textContent = time + " (Click to delete)";
        li.onclick = () => {
            alarms.splice(index, 1);
            renderAlarms();
        };
        alarmList.appendChild(li);
    });
}

setInterval(() => {
    const now = new Date();
    const current = now.toTimeString().slice(0, 5);

    if (alarms.includes(current)) {
        alert("⏰ Alarm ringing!");
        alarms.splice(alarms.indexOf(current), 1);
        renderAlarms();
    }
}, 1000);


let swTime = 0;
let swInterval;

function updateStopwatch() {
    const hrs = String(Math.floor(swTime / 3600)).padStart(2,"0");
    const mins = String(Math.floor((swTime % 3600) / 60)).padStart(2,"0");
    const secs = String(swTime % 60).padStart(2,"0");

    document.getElementById("stopwatchDisplay").innerText = `${hrs}:${mins}:${secs}`;
}

document.getElementById("swStart").onclick = () => {
    if (!swInterval) {
        swInterval = setInterval(() => {
            swTime++;
            updateStopwatch();
        }, 1000);
    }
};

document.getElementById("swStop").onclick = () => {
    clearInterval(swInterval);
    swInterval = null;
};

document.getElementById("swReset").onclick = () => {
    swTime = 0;
    updateStopwatch();
    document.getElementById("lapList").innerHTML = "";
};

let timerInterval;
let timerRemaining = 0;

function updateTimerDisplay() {
    const m = String(Math.floor(timerRemaining / 60)).padStart(2,"0");
    const s = String(timerRemaining % 60).padStart(2,"0");
    document.getElementById("timerDisplay").innerText = `${m}:${s}`;
}

document.getElementById("timerStart").onclick = () => {
    if (!timerRemaining) {
        const mins = Number(document.getElementById("timerMinutes").value);
        const secs = Number(document.getElementById("timerSeconds").value);

        if (mins === 0 && secs === 0) return alert("Enter valid time!");

        timerRemaining = mins * 60 + secs;
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerRemaining > 0) {
            timerRemaining--;
            updateTimerDisplay();
        }
        else {
            clearInterval(timerInterval);
            alert("⏳ Time's Up!");
        }
    }, 1000);
};

document.getElementById("timerPause").onclick = () => clearInterval(timerInterval);

document.getElementById("timerReset").onclick = () => {
    clearInterval(timerInterval);
    timerRemaining = 0;
    updateTimerDisplay();
};


function updateWorldClocks() {
    const zones = [
        { id: "nyTime", zone: "America/New_York" },
        { id: "lonTime", zone: "Europe/London" },
        { id: "dubaiTime", zone: "Asia/Dubai" },
        { id: "tokyoTime", zone: "Asia/Tokyo" },
        { id: "sydneyTime", zone: "Australia/Sydney" },
    ];

    zones.forEach(z => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", {
            timeZone: z.zone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !is24Hour,
        });

        document.getElementById(z.id).innerText = timeStr;
    });
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

// ======================================================
//  WEATHER (OPENWEATHER API)
// ======================================================
const API_KEY = "6d14fad6b0d021f1f25e0837a962ef3b";

document.getElementById("getWeatherBtn").onclick = async () => {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) return alert("Enter a city name.");

    if (API_KEY === "PUT_YOUR_API_KEY_HERE") {
        alert("Add your OpenWeather API key in script.js first.");
        return;
    }

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) return alert("City not found.");

        const data = await res.json();

        document.getElementById("weatherResult").innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>${data.weather[0].description.toUpperCase()}</p>
            <p>Temperature: ${Math.round(data.main.temp)}°C</p>
            <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
        `;
    }
    catch (error) {
        console.log(error);
        alert("Weather fetch error.");
    }
};
