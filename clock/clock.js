const day = document.querySelector("#displayDay");
const clock = document.querySelector("#timeValue");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

setInterval(function() {
    let date = new Date();
    let sec = date.getSeconds();
    let min = date.getMinutes();
    let hr = date.getHours();
    let daynight = 'AM';

    if(hr > 12) {
        daynight = 'PM';
        hr = hr - 12;
    }

    if(hr == 0) {
        hr = 12;
    }

    if(sec < 10) {
        sec = '0' + sec;
    }
    if(min < 10) {
        min = '0' + min;
    }
    if(hr < 10) {
        hr = '0' + hr;
    }

    day.textContent = days[date.getDay()];
    clock.textContent = hr + ':' + min + ':' + sec + " " + daynight;
});