let _id = window.location.pathname.split('/')[3];

/*
 * Sources
 */

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
  // separate authors- & keywords-string (try-catch in case is still empty)
  try {
    newSource['authors'] = newSource['authors'].split(',').map(function(item){return item.trim();});
  } catch(err) {}
  try {
    newSource['keywords'] = newSource['keywords'].split(',').map(function(item){return item.trim();});
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
};

/*
 * SREs
 */

let compileSRE = function() {
  let sre = {};
  // read input fields
  $("form#newSRE-form :input").each(function(){
    let input = $(this);
    let val = input.val(),
      type = input.attr('type'),
      name = input.attr('name');
    if (type !== 'submit' && val !== "") {
      // TODO: properly chcek for non-comma-separated values, then do single-attr-fill
      if (name === 'prev_ptr')
        sre['prev_ptr'] = val;
      else if (name === 'backlog')
        sre['backlog'] = val;
      else {
        // separate list-strings (try-catch in case is still empty)
        try {
          sre[name] = val.split(',').map(function(item){return item.trim();});
        } catch(err) {}
      }
    }
  });
  // add ts
  let now = new Date();
  sre['ts'] = now.toISOString();

  return sre;
};

let validateSRE = function(sre) {
  let errors = [];
  // check required inputs
  $.each(['platforms', 'keywords', 'backlog'], function(key, val) {
    if (isEmptyArray(sre[val]))
      errors.push('Required attribute [' +val+ '] has no values');
  });

  return errors;
};


/*
 * Page-actions:
 */

let fillForm = function(draft) {
  let keysSngl = ['prev_ptr'];
  let keysMulti = ['platforms', 'keywords', 'sources'];
  // fill single-string inputs
  for (i in keysSngl) {
    let key = keysSngl[i];
    try {
      let inputAppend = $('input[name="'+key+'"]');
      inputAppend.val(draft[key]);
    } catch(err) {}
  }
  // fill multi-string inputs
  for (i in keysMulti) {
    let key = keysMulti[i];
    try {
      let inputAppend = $('input[name="'+key+'"]');
      inputAppend.val(arrayOfStringsToString(draft[key]));
    } catch(err) {}
  }
  // fill ul with source information
  try{
    let srcIds = draft.sources;
    for (i in srcIds) {
      $.get('/api/sources/'+srcIds[i]).done(function(source) {
        let str;
        if (source.authors !== undefined)
          str = '<li>"'+source.title+'" by '+source.authors+'</li>';
        else
          str = '<li>"'+source.title+'"</li>';
        $('#retrievedSources-ul').append(str);
      });
    }
  } catch(err) {}

  // backlog not loaded from draft (input with type file has no value attribute)
};

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
    $.post('/api/sources', newSource, function() {
      toastr.success('Saving new source!');
    }).done(function(data) {
      console.log('Received feedback:', data);
      
      // append characteristics of new Source to SRE ...
      $('#retrievedSources-ul').append('<li>"'+data.source.title+'" by '+data.source.authors+'</li>');
      // ... also to hidden input field ...
      let hiddenAppend = $('input[name="sources"]');
      if (hiddenAppend.val() === "")
        hiddenAppend.val(data.source._id);
      else
        hiddenAppend.val(hiddenAppend.val() + ',' + data.source._id);
      // ... and also to referencing-selection in add-new-src!
      $('select[name="src-ptrs"]').append('<option value="'+data.source._id+'"> "'+data.source.title+'" by '+data.source.authors);

      saveSreDraft();   // js-update does not trigger hidden-input-onChange
    });
  }
};

let saveSreDraft = function() {
  let newSre = compileSRE();
  newSre['status'] = 'active';

  $.post('/api/sres/'+_id, newSre).done(function(data) {
    console.log(data);
  });
};

let saveSre = function() {
  let newSre = compileSRE();
  let errors = validateSRE(newSre);

  // warn if no sources attached
  if (isEmptyArray(newSre['sources']))
    toastr.warn('Required attribute ['+val+'] has no values');

  // if there are errors, display them; otherwise post source
  if (errors.length > 0) {
    $.each(errors, function(key, val) {
      toastr.error(val);
    });
  } else {
    newSre['status'] = 'done';
    $.post('/api/sres/'+_id, newSre, function() {
      toastr.success('Saving new SRE!');
    }).done(function(data) {
      window.location = "/admin/queries/"+newSre.prev_ptr;
    });
  }
};



let disableInputs = function() {
  $('h1').html('Viewing Source Retrieval Effort (SRE)');
  $('form :input').prop("disabled", true);
};


$(document).ready(function(){
  $.get('/api/sres/'+_id).done(function(data) {
    console.log('Received sre-draft (sre_id: '+_id+'):', data);
    fillForm(data);

    if (data.status !== 'done')
      saveSreDraft();       // make query active
    else
        disableInputs();
  });
});
