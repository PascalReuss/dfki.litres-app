var isEmptyArray = function(array) {
  if (typeof(array) === "object" && array.length == 0) {
    return true;
  } else {
    return false;
  }
}

var arrayOfStringsToString = function(array) {
  if (array.length === 0)
    return "";
  else if (array.length === 1)
    return array[0];
  else {
    var str = array[0];
    for (i in array) {
      if (i > 0)
        str = str + "," + array[i];
    }
    return str;
  }
}