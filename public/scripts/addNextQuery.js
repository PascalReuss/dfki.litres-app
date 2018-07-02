let compileQueryDraft = function() {
    let query = {};

    query['prev_ptr'] = window.location.pathname.split('/')[4];
    query['descr'] = $('textarea[name="nxt-descr"]').val();

    return query;
};

let postConnectedQuery = function() {
    let newQueryDraft = compileQueryDraft();
    newQueryDraft['status'] = 'draft';
    newQueryDraft['litRes'] = _litRes;  // var litRes declared in all js-files that include this modal 

    $.post('/api/queries', newQueryDraft, function() {
        toastr.success('Posting new connected Query!');
    }).done(function(data) {
        console.log('Received feedback:', data);
    });
    
    document.getElementById('newNextQuery-form').reset();
    $('.modal').modal('hide');
};

