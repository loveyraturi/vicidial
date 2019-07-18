var dateTime = require('date-and-time')
var mysql = Array();
mysql['group_concat'] = "group_concat(%0% SEPARATOR '\n')"
mysql['timediff'] = "CONCAT(FLOOR(HOUR(TIMEDIFF(%0%, %1%)) / 24), ' days ', MOD(HOUR(TIMEDIFF(%0%, %1%)), 24), ' hours ',   MINUTE(TIMEDIFF(%0%, %1%)), ' minutes')"


var pg = Array();
pg['group_concat'] = "array_to_string(array_agg(%0%), ',')"
pg['timediff'] = "concat(DATE_PART('day', %0%::timestamp - %1%::timestamp), ' Days ', DATE_PART('hours', %0%::timestamp - %1%::timestamp), ' Hours ',DATE_PART('minutes', %0%::timestamp - %1%::timestamp), ' Minutes')"

var createRawQuery = function(operation, fieldArr){
    var defString = '';
    switch(process.env.DB_ENGINE){
        case 'mysql':
            defString = mysql[operation]
        break;
        case 'pg':
            defString = pg[operation]
        break;
        case 'default':
            defString = mysql[operation]
        break;
    }
    fieldArr.forEach((element, key) => {
        
        defString = defString.replace(new RegExp("%"+key+"%", 'g'), element);
    });

    return defString
}

var dateSub = function(date, diff, difFormat='hour'){
    
    var year = '20'+date.substring(0, 2)
    var month = date.substring(2, 4)
    var day = date.substring(4, 6)

    var hour = date.substring(6, 8)
    var min = date.substring(8, 10)
    var sec = date.substring(10, 12)

    var now = new Date(year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec);


    dateTime.format(now, 'YYYY/MM/DD HH:mm:ss'); 
    var nextDate = ''

    switch(difFormat){
        case 'year':
            nextDate = dateTime.addYears(now, (-1)*diff); 
        break;
        case 'month':
            nextDate = dateTime.addMonths(now, (-1)*diff); 
        break;
        case 'day':
            nextDate = dateTime.addDays(now, (-1)*diff); 
        break;
        case 'hour':
            nextDate = dateTime.addHours(now, (-1)*diff);
        break;
        case 'min':
            nextDate = dateTime.addMinutes(now, (-1)*diff);
        break;
        case 'sec':
            nextDate = dateTime.addSeconds(now, (-1)*diff);
        break;
    }

    return dateTime.format(nextDate, 'YYMMDDHHmmss'); 
}

var configureDateTime = function(dateval){
    return (dateval=='0000-00-00 00:00:00')?'1971-12-12 00:00:01':dateval
}

module.exports.createRawQuery = createRawQuery
module.exports.dateSub = dateSub
module.exports.configureDateTime = configureDateTime