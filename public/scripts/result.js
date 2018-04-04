let _id = window.location.pathname.split('/')[3];

/*
* Result
*/

let compileResult = function() {
    let result = {};

    // read input fields
    $("form#newResult-form :input").each(function(){
        let input = $(this);
        let val = input.val(),
            type = input.attr('type'),
            name = input.attr('name');
        if (type !== 'submit' && type !== 'button' && val != '')
        result[name] = val;
    });
    // add ts
    let now = new Date();
    result['ts'] = now.toISOString();

    return result;
};
  
  
/*
* Page-actions:
*/
  
let fillForm = function(draft) {
    $("form#newResult-form :input").each(function(){
        let input = $(this);
        let type = input.attr('type'),
            name = input.attr('name');
        if (type !== "submit") {
            // try {   // prev_ptr is optional
            input.val(draft[name]);
            // } catch(err) {}
        }
    });
};

let saveResultDraft = function() {
    let newResult = compileResult();
    newResult['status'] = 'active';

    $.post('/api/results/'+_id, newResult).done(function(data) {
        console.log(data);
    });
};

let saveResult = function() {
    let newResult = compileResult();
    newResult['status'] = 'done';

    // note: errors are caught by html-form-warnings ...
    
    $.post('/api/results/'+_id, newResult, function() {
        toastr.success('Saving new Result!');
    }).done(function(data) {
        window.location = "/admin";
    });
};


$(document).ready(function(){
    $.get('/api/results/'+_id).done(function(data) {
        console.log('Received result-draft:', data);
        fillForm(data);
        saveResultDraft();       // make result active
    });
});
  