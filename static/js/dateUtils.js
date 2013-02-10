/*
  %Y Full Year
  %y 2 digit Year               00 - 99

  %d 2 digit day of month       01 - 31
  %j day of month                1 - 31

  %F name of Month              Janurary, February ...
  %M 3 character name of month  Jan, Feb ...

  %m 2 digit month              01 - 12


	// month n digits 1
	str = str.replace("%n", this.dt.getMonth() + 1);
	// am pm
	str = str.replace("%a", (this.dt.getHours() < 12)?"am":"pm");
	str = str.replace("%A", (this.dt.getHours() < 12)?"AM":"PM");
	// 12 hr
	str = str.replace("%g", this.dt.getHours()===0?12:this.dt.getHours()%12);
	str = str.replace("%h", this.to2(this.dt.getHours()===0?12:this.dt.getHours()%12));
	// 24 hr
	str = str.replace("%G", this.dt.getHours());
	str = str.replace("%H", this.to2(this.dt.getHours()));
	// mins
	str = str.replace("%i", this.to2(this.dt.getMinutes()));
	// secs
	str = str.replace("%s", this.to2(this.dt.getSeconds()));
	// secs since epoch
	str = str.replace("%U", this.dt.getTime());
	// day of week
	str = str.replace("%l", this.dowList[this.settings.lang][this.dt.getDay()]);
	str = str.replace("%D", this.dowList[this.settings.lang][this.dt.getDay()].substr(0,3));
	// Suffix st th ...
	str = str.replace("%S", this.suffixList[this.settings.lang][this.dt.getDate()%10]);


function runTests(){
    d = new DatePlus(new Date(2012,0,1,0,0,0), {lang:"fr", format:"%j%S %F %Y %h:%i:%s"});
    d2 = new DatePlus(new Date(), {lang:"fr"});

    d.setFormat("Y-%Y y-%y d-%d j-%j n-%n m-%m F-%F M-%M a-%a A-%A g-%g G-%G h-%h H-%H i-%i s-%s U-%U l-%l D-%D S-%S");
    console.log(d.toString())

    console.log(d.setFormat("%j%S %F %Y %h:%i:%s").toString());
    console.log(d2.setFormat("%j%S %F %Y %h:%i:%s").toString());

    var dd = d.dateDiff(d2);
    console.log(d.datePartsToString(dd));

    d.autoUpdate(0,1, function(d){
	$("#clock").html(d.toString());
    });

    d3 = d2.firstDayInMonthsAgo(13);
    console.log(d3, d3.toString());

    d3 = d2.firstDayInPreviousWeeksAgo(1);
    console.log(d3, d3.toString());
}


*/

function DatePlus(dt, settings){
    // defaults
    this.settings = {};
    this.settings.lang = "en";
    this.settings.format = "%j%S %F %Y %h:%i:%s";
    // loaded settings
    for(setting in settings){
	this.settings[setting] = settings[setting]
    }
    if(dt === undefined){
	this.dt = new Date();
    } else {
	if(dt instanceof DatePlus){
	    this.dt = dt.dt;
	} else {
	    this.dt = dt;
	}
    }
    return this;
}

DatePlus.prototype.monthList = {
    "en": ['January','February','March','April','May','June','July','August','September','October','November','December'],
    "fr": ['Janvier','Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
};
DatePlus.prototype.dowList = {
    "en": ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    "fr": ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
};
DatePlus.prototype.suffixList = {
    "en": ['th','st','nd','rd','th','th','th','th','th','th','th'],
    "fr": ['e','er','e','e','e','e','e','e','e','e','e']
};
DatePlus.prototype.unitsList = {
    "en": ["days", "hours", "mins", "secs", "ms"],
    "fr": ["jours", "heures", "mins", "secs", "ms"]
}
DatePlus.prototype.to2 = function(s){ return ("0" + s).substr(("0" + s).length -2) };

DatePlus.prototype.toString = function(withTime){
    if(this.settings.format === undefined){
	var str = this.dt.getDate() + "-" +  this.monthList[this.settings.lang][this.dt.getMonth()] + "-" +  this.to2(this.dt.getFullYear());
	if(withTime){
	    var hours = this.dt.getHours() % 12;
	    if(hours === 0){
		hours = 12;
	    }
	    str += " " + hours + ":" + to2(this.dt.getMinutes());
	    if(this.dt.getHours() > 12){
		str += "pm";
	    } else {
		str += "am";
	    }
	}
	return str;
    } else {
	var str = this.settings.format;
	// year full
	str = str.replace("%Y", this.dt.getFullYear());
	// year 2 digits
	str = str.replace("%y", this.to2(this.dt.getFullYear()));
	// day of month 2 digits
	str = str.replace("%d", this.to2(this.dt.getDate()));
	// day of month 
	str = str.replace("%j", this.dt.getDate());
	// month F January 
	str = str.replace("%F", this.monthList[this.settings.lang][this.dt.getMonth() ]);
	// month m 01 - 12
	str = str.replace("%m", this.to2(this.dt.getMonth() + 1));
	// month M Jan 
	str = str.replace("%M", this.monthList[this.settings.lang][this.dt.getMonth()].substr(0,3));
	// month n digits 1
	str = str.replace("%n", this.dt.getMonth() + 1);
	// am pm
	str = str.replace("%a", (this.dt.getHours() < 12)?"am":"pm");
	str = str.replace("%A", (this.dt.getHours() < 12)?"AM":"PM");
	// 12 hr
	str = str.replace("%g", this.dt.getHours()===0?12:this.dt.getHours()%12);
	str = str.replace("%h", this.to2(this.dt.getHours()===0?12:this.dt.getHours()%12));
	// 24 hr
	str = str.replace("%G", this.dt.getHours());
	str = str.replace("%H", this.to2(this.dt.getHours()));
	// mins
	str = str.replace("%i", this.to2(this.dt.getMinutes()));
	// secs
	str = str.replace("%s", this.to2(this.dt.getSeconds()));
	// secs since epoch
	str = str.replace("%U", this.dt.getTime());
	// day of week
	str = str.replace("%l", this.dowList[this.settings.lang][this.dt.getDay()]);
	str = str.replace("%D", this.dowList[this.settings.lang][this.dt.getDay()].substr(0,3));
	// Suffix st th ...
	str = str.replace("%S", this.suffixList[this.settings.lang][this.dt.getDate()%10]);
	return str;
    }
}
DatePlus.prototype.setFormat = function(fmt){
    this.settings.format = fmt;
    return this;
}

DatePlus.prototype.firstDayInMonthsAgo = function(numMonthsAgo) {
    d = new DatePlus(new Date(this.dt.getFullYear(), this.dt.getMonth() - numMonthsAgo, 1));
    d.settings = this.settings;
    return d;
}

DatePlus.prototype.firstDayInPreviousWeeksAgo = function(weeksAgo){
    var dow = this.dt.getDay();
    var daysAgo = (7 * weeksAgo) + dow;
    d = new DatePlus(new Date(this.dt.getFullYear(), this.dt.getMonth(), this.dt.getDate() - daysAgo));
    d.settings = this.settings;
    return d;
}
DatePlus.prototype.dateAdd = function(dt, yearDiff, monthDiff, dayDiff, hourDiff, minDiff, secDiff, msDiff){
    return new Date(dt.getFullYear() + yearDiff, dt.getMonth() + monthDiff, dt.getDate() + dayDiff,
		    dt.getHours() + hourDiff, dt.getMinutes() + minDiff, dt.getSeconds() + secDiff, dt.getMilliseconds() + msDiff);
}
DatePlus.prototype.dateMath = function(yearDiff, monthDiff, dayDiff, hourDiff, minDiff, secDiff, msDiff){
    this.dt = this.dateAdd(this.dt, yearDiff, monthDiff, dayDiff, hourDiff, minDiff, secDiff, msDiff);
    return this;
}
DatePlus.prototype.msToDateparts = function(ms){
    var divs = [1000,60,60,24];
    var curr = 0;
    var ret = [];
    for (var x=0; x<divs.length; x++){
	curr = ms%divs[x];
	ret.push(curr);
	ms = (ms-curr)/divs[x];
    }
    ret.push(ms);
    return ret.reverse();
}
DatePlus.prototype.datePartsToString = function(dparts){
    var str = "";
    var isAgo = false;
    for (var i=0; i< this.unitsList[this.settings.lang].length; i++){
	if(dparts[i] < 0){
	    isAgo = true;
	}
	if(dparts[i] !== 0){
	    str += " " + Math.abs(dparts[i]) + " " + this.unitsList[this.settings.lang][i];
	}
    }
    if (isAgo){
	str += " ago";
    }
    return str;
}
DatePlus.prototype.dateDiff = function(d2){
    var diff = 0;
    if(d2 instanceof DatePlus){
	diff = d2.dt - this.dt; 
    } else if(d2 instanceof Date){
	diff = d2 - this.dt; 
    }
    return this.msToDateparts(diff);
}
DatePlus.prototype.autoUpdate = function(min, secs, fn){
    var that = this;
    var origTime = new Date().getTime();
    var stTime = this.dt.getTime();
    this.interVal = setInterval(function(){
	var now = new Date().getTime();
	that.dt = new Date(origTime + (now - stTime))
	fn(that);
    },((min * 60) + secs) * 1000);
    return this;
}
DatePlus.prototype.cancelAutoUpdate = function(){
    clearInterval(this.interVal);
    return this;
}


function datePeriod(dtStart, dtEnd){
    this.dtStart = new datePlus(dtStart);
    this.dtEnd = new DatePlus(dtEnd);
}
function secondsToFmtd(secs){
    return secondsToFormattedDate(secs) + " " + secondsToUnits(secs);
}
function secondsToFormattedDate(secs){
    hours = secs/60/60;
    if(hours<24){
	return Math.floor(hours * 100) / 100
    } else {
	return Math.floor((hours / 24) *100) / 100;
    }
}
function secondsToUnits(secs){
    var hours = Math.floor(secs/60/60 * 100) / 100;
    if(hours<24){
	return "hours";
    }else{
	return "days";
    }
}
function sqlDateStringToDate(dtStr){
    var dtTime = dtStr.split(" ");
    var dParts = dtTime[0].split("-");

    if (dtTime.length > 1){
	var p2 = dtTime[1].split(":");
	var asDate = new Date(dParts[0], dParts[1] -1, dParts[2], p2[0], p2[1], p2[2]);
    } else {
	var asDate = new Date(dParts[0], dParts[1] -1, dParts[2]);
    }
    return asDate;
}
function stringToDate(st){
    var parts = st.split("-");
    return new Date(parts[0], parts[1] - 1, parts[2]);
}



function dateToSQLString(dt, withTime){
    var str = dt.getFullYear() + "-" +  (dt.getMonth() + 1) + "-" + dt.getDate();
    if(withTime){
	str += " " + dt.getHours() + ":" + to2(dt.getMinutes());
    }
    return str;
}


function buildDatePicker(fmEl, toEl){
    setTimeout(function(fmEl, toEl){

	var el = $("<span>");
	stPicker = $find(stPicker);
	edPicker = $find(edPicker);
	el.append(" <span class='date-range-picker button'>Last Month</span> ");
	el.append("<span class='date-range-picker button'>Last Week</span>");
	$("#regenerate").after(el);
	
	$(".date-range-picker").click(function(e){
	    var p = getNamedPeriod($(this).text());
	    stPicker.set_selectedDate(new Date(p[0]));
	    edPicker.set_selectedDate(new Date(p[1]));
	})
	$("#pds,#pde").show();
    }, 1000);
    
}


function isArray(someVar){
    return Object.prototype.toString.call( someVar ) === '[object Array]';
}

