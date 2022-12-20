exports.getDate = getDate;
function getDate(){
    const date = new Date(); 
    const options = {'weekday':'long',
    'day':'numeric',
    'month':'long',
    'timeZone':'Asia/Kolkata'};
    return date.toLocaleDateString("en-US", options);

}

exports.getDay = getDay;
function getDay(){
    const date = new Date(); 
    const options = {'weekday':'long'};
    return date.toLocaleDateString("en-US", options);
}