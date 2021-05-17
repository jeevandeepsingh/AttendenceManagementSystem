function func1(start, end, date)
{
    var timeEnd = new Date(date + " " + end);
    var timeStart = new Date(date + " " + start);

    var diff = (timeEnd - timeStart) / 60000; //dividing by seconds and milliseconds

    var minutes = diff % 60;
    var hours = (diff - minutes) / 60;

    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    
    return (hours + ":" + minutes);
}

module.exports.calculateHoursDiff = function (checkin, checkout, date)
{
    const Months = ['Jan','Feb','Mar','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    let months = new Map();
    for(let i = 0 ; i < Months.length ; i++)
    {
        months[Months[i]] = i+1;
    }

    const arr1 = checkin.split(':')
    const arr2 = checkout.split(':')
    const arr3 = date.split(" ");

    let timeStart = arr1[0] + ":" + arr1[1] + " " + arr1[2][3]+arr1[2][4];
    let timeEnd   = arr2[0] + ":" + arr2[1] + " " + arr2[2][3]+arr2[2][4];
    let daTe      = months[arr3[2]] + "/" + arr3[0] + "/" + arr3[3];
    return func1(timeStart, timeEnd, daTe);
}