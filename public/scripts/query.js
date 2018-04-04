let _id = window.location.pathname.split('/')[3];

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
            try {   // prev_ptr is optional
                input.val(draft[name]);
            } catch(err) {}
        }
    });
};

let saveQueryDraft = function() {
    let newQuery = compileQuery();
    newQuery['status'] = 'active';

    $.post('/api/queries/'+_id, newQuery).done(function(data) {
        console.log(data);
    });
};

let saveQuery = function() {
    let newQuery = compileQuery();
    newQuery['status'] = 'done';

    // note: errors are caught by html-form-warnings ...
    
    $.post('/api/queries/'+_id, newQuery, function() {
        toastr.success('Saving new Query!');
    }).done(function(data) {
        window.location = "/admin/processes?prev_ptr="+_id;
    });
};

let engageSre = function() {
    window.location = '/admin/sres?prev_ptr='+_id;
}


$(document).ready(function(){
    $.get('/api/queries/'+_id).done(function(data) {
        fillForm(data);
        console.log('Received query-draft (query_Id: '+_id+'):', data);
        saveQueryDraft();       // make query active
    });
});
  