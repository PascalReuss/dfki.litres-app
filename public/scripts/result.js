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



let disableInputs = function() {
    $('h1').html('Viewing Result');
    $('form :input').prop("disabled", true);
};


$(document).ready(function(){
    $.get('/api/results/'+_id).done(function(rItem) {
        console.log('Received result-draft:', rItem);
        fillForm(rItem);
        $.get('/api/processes/'+rItem.prev_ptr).done(function(pItem) {
            $.get('/api/queries/'+pItem.prev_ptr).done(function(qItem) {
                $('#qpLinks').append(`
                    <a target="_blank" href="/admin/queries/${qItem._id}">
                        <button class="btn btn-link" type="button")>
                            View query-item
                        </button>
                    </a>
                    <a target="_blank" href="/admin/processes/${pItem._id}">
                    <button class="btn btn-link" type="button") style="float:right;">
                        View process-item
                    </button>
                    </a>
                `);
            });
        });

        if (rItem.status !== 'done')
            saveResultDraft();       // make result active
        else
            disableInputs();
    });
});
  