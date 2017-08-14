
function padZero(num) {
      if(num <= 9 && num >= 0) {
          return '0' + num;
      } else {
          return(num);
      }
}

var formatTs = function(ts) {
    if (ts === 0) {
		return "";
	} else {
		var d = new Date(ts*1000);
		return ("" + d.getFullYear() + "-" + padZero(d.getMonth()) + "-" +  padZero(d.getDate()) + " " +  padZero(d.getHours()) + ":" + padZero(d.getMinutes()) + ":" + padZero(d.getSeconds()));
	}
}

export default formatTs;
