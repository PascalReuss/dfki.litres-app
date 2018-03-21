let queryId = window.location.pathname.split('/')[3];

/*
* Query
*/
  
let compileQuery = function() {
    let query = {};

    // read input fields
    $("form#newQuery-form :input").each(function(){
        let input = $(this);
        let val = input.val(),
            type = input.attr('type'),
            name = input.attr('name');
        if (type !== 'submit' && val !== "" && !isEmptyArray(val))
            query[name] = val;
    });
    // add ts
    let now = new Date();
    query['ts'] = now.toISOString();
    
    return query;
};
  
  
/*
* Page-actions:
*/
  
let fillForm = function(draft) {
    $("form#newQuery-form :input").each(function(){
        let input = $(this);
        let type = input.attr('type'),
            name = input.attr('name');
        if (type !== "submit") {
            input.val(draft[name]);
        }
    });
};

let saveQueryDraft = function() {
    let newQuery = compileQuery();
    $.post('/api/drafts/'+queryId, newQuery).done(function(data) {
      console.log(data);
    });
};
  
// let saveQuery = function() {
//     let newQuery = compileQuery();

//     // warn if no sources attached
//     if (isEmptyArray(newSre['sources']))
//         toastr.warn('Required attribute [' +val+ '] has no values');

//     // if there are errors, display them; otherwise post source
//     if (errors.length > 0) {
//         $.each(errors, function(key, val) {
//         toastr.error(val);
//         });
//     } else {
//         $.post('/api/sres', newSre, function() {
//         toastr.success('Saving new SRE!');
//         }).done(function(data) {
//         $.post('/api/drafts/sre', {});  // clear sre draft
//         console.log('Received feedback:', data);
//         });
//     }
// };
  

$(document).ready(function(){
    $.get('/api/drafts/'+queryId).done(function(data) {
        fillForm(data);
        console.log('Received query-draft (queriId: '+queryId+'):', data);
    });
});
  