var isEmptyArray = function(array) {
  if (typeof(array) === "object" && array.length == 0) {
    return true;
  } else {
    return false;
  }
}