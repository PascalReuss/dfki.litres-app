let _id = window.location.pathname.split('/')[3];

/*
* Process
*/
  
let compileProcess = function() {
    let process = {};

    // read input fields
    $("form#newProcess-form :input").each(function(){
        let input = $(this);
        let val = input.val(),
            type = input.attr('type'),
            name = input.attr('name');
        if (type !== 'submit' && val !== "" && !isEmptyArray(val))
            if (!['prev_ptr', 'proposition'].includes(name)) {       // all src-specific info ...
                let srcId = name.substring(0,24),
                    realName = name.slice(24);
                if (process[srcId] === undefined) {
                    process[srcId] = {};
                }
                process[srcId][realName] = val;
            } else {
                process[name] = val;
            }
    });
    // add ts
    let now = new Date();
    process['ts'] = now.toISOString();

    return process;
};

let validateProcess = function(process) {
    let errors = [];
    // check inherent process data
    $.each(['proposition'], function(key, val) {
      if (process[val] === undefined)
        errors.push('Required attribute [' +val+ '] missing');
    });
    // check source quality data
    $.each(['q-applicability', 'q-relevance', 'q-holism'], function(key, val) {
        $.each(process, function(attr) {
            if (!['prev_ptr', 'proposition', 'ts'].includes(attr)) {
                if (process[attr][val] === undefined)
                    errors.push('Required attribute [' +val+ '] missing');
                if (process[attr][val] < 0)
                    errors.push('Attribute [' +val+ ']to small (< 0)');
                if (process[attr][val] > 7)
                    errors.push('Attribute [' +val+ '] to big (> 7)');
            }
        });
    });
  
    return errors;
  };

/*
* Page-actions:
*/
  
let fillForm = function(draft) {
    $("form#newProcess-form :input").each(function(){
        let input = $(this);
        let type = input.attr('type'),
            name = input.attr('name');
        if (type !== "submit" && type !== "button") {
            if (!['prev_ptr', 'proposition'].includes(name)) {       // all src-specific info ...
                let srcId = name.substring(0,24),
                    realName = name.slice(24);
                try {
                    input.val(draft[srcId][realName]);
                } catch(err) {}
            } else {
                try {   // proposition might not have been filled out yet (prev_ptr is mandatorily there already though)
                    input.val(draft[name]);
                } catch(err) {}
            }
        }
    });
};

let saveProcessDraft = function() {
    let newProcess = compileProcess();
    newProcess['status'] = 'active';

    $.post('/api/processes/'+_id, newProcess).done(function(data) {
        console.log(data);
    });
};

let saveProcess = function() {
    let newProcess = compileProcess();
    let errors = validateProcess(newProcess);

    // if there are errors, display them; otherwise post source
    if (errors.length > 0) {
        $.each(errors, function(key, val) {
            toastr.error(val);
        });
    } else {
        newProcess['status'] = 'done';
        $.post('/api/processes/'+_id, newProcess, function() {
            toastr.success('Saving new Process-item!');
        }).done(function(data) {
            window.location = "/admin/results?prev_ptr="+_id;
        });
    }    
};



let disableInputs = function() {
    $('h1').html('Viewing Process');
    $('form :input').prop("disabled", true);
};


$(document).ready(function(){
    $.get('/api/processes/'+_id).done(function(pItem) {
        console.log('Received process-draft:', pItem);
        fillForm(pItem);
        $.get('/api/queries/'+pItem.prev_ptr).done(function(qItem) {
            $('#queryDescr').append(qItem.descr);
        });
        
        if (pItem.status !== 'done')
            saveProcessDraft();       // make process active
        else
            disableInputs();
    });
});
  