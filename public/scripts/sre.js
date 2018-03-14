let compileSource = function() {
  let newSource = {};
  // for each input, add key-value attribute to source object 
  $("form#newSource-form :input").each(function(){
    let input = $(this);
    let val = input.val(),
      type = input.attr('type'),
      name = input.attr('name');
    if (type !== 'submit' && val !== "" && !isEmptyArray(val))
      newSource[name.slice(4)] = val;
  });
  //separate authors-string (try-catch in case is still empty)
  try {
    newSource['authors'] = newSource['authors'].split(',');
  } catch(err) {}
  // add urldate
  let now = new Date();
  newSource['urldate'] = now.toISOString().slice(0,10);

  return newSource;
};

let validateSource = function(source) {
  let errors = [];
  // check source data
  $.each(['url', 'type', 'title', 'date', 'abstract'], function(key, val) {
    if (source[val] === undefined)
      errors.push('Required attribute [' +val+ '] missing');
  });
  // check quality assessment info
  $.each(['q-subjectRelevance', 'q-informativeContent', 'q-context', 'q-illustration'], function(key, val) {
    if (source[val] === undefined)
      errors.push('Required attribute [' +val+ '] missing');
    if (source[val] < 0)
      errors.push('Attribute [' +val+ ']to small (< 0)');
    if (source[val] > 7)
      errors.push('Attribute [' +val+ '] to big (> 7)');
  });

  return errors;
}

let saveSrc = function() {
  let newSource = compileSource();
  let errors = validateSource(newSource);
  
  // if there are errors, display them; otherwise post source
  if (errors.length > 0) {
    $.each(errors, function(key, val) {
      toastr.error(val);
    });
  } else {
    $('.modal').modal('hide');
    document.getElementById('newSource-form').reset();
    $.post('/api/source', newSource, function() {
      toastr.success('Saving new source!');
    }).done(function(data) {
      console.log('Received feedback:', data);
    });
  }
};

$(document).ready(function(){
  console.log('Page ready.');
});