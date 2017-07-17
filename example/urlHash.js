function getUrlHashParameter(param) {

  var params = getUrlHashParameters();
  return params[param];

}

function getUrlHashParameters() {

  var sPageURL = window.location.hash;
  if (sPageURL) sPageURL = sPageURL.split('#')[1];
  var pairs = sPageURL.split('&');
  var object = {};
  pairs.forEach(function(pair, i) {
    pair = pair.split('=');
    if (pair[0] != '') object[pair[0]] = pair[1];
  });
  return object;
}

// accepts an object like { paramName: value, paramName1: value }
// and transforms to: url.com#paramName=value&paramName1=value
function setUrlHashParameters(params) {

  var keys = Object.keys(params);
  var values = Object.values(params);
  var pairs = [];
  keys.forEach(function(key, i) {
    if (key != '') pairs.push(keys[i] + '=' + values[i]);
  });
  var hash = pairs.join('&');
  window.location.hash = hash;

}

function setUrlHashParameter(param, value) {

  var params = getUrlHashParameters();
  params[param] = value;
  setUrlHashParameters(params);

}
