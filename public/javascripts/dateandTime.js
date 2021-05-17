const Months = ['Jan','Feb','Mar','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const Days = ['Sun','Mon','Tues','Wednes','Thurs','Fri','Sat'];
    
function to12HourFormat(date = (new Date)) {
    return {
      hours: ((date.getHours() + 11) % 12 + 1),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      meridian: (date.getHours() >= 12) ? 'PM' : 'AM',
    };
}

module.exports.calculateTime = () => {
    let time = to12HourFormat();
    time.hours = (time.hours < 10 ? '0' : '') + time.hours;
    time.minutes = (time.minutes < 10 ? '0' : '') + time.minutes;
    time.seconds = (time.seconds < 10 ? '0' : '') + time.seconds;
    return time.hours + ":" + time.minutes + ":" + time.seconds + " " + time.meridian;
}

module.exports.calculateDate = () => {
    let today = new Date();
    let ts = Date.now();
    let date_ob = new Date(ts);
    let dd = date_ob.getDate();
    let yy = date_ob.getFullYear();

    return (dd + " "  + Days[today.getDay()] + " " + Months[today.getMonth()] + " " + yy);
}