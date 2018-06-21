let _id = window.location.pathname.split('/')[2];

let updateInfo = function() {
    let info = {},
        keys = ['researcher','supervisor','title','research-Question'];
    keys.forEach(function(key, i) {
        info[key] = $('form :input[name='+key+']').val();
        if (i === keys.length - 1) {
            info['status'] = 'active';
            $.post('/api/info/'+_id, info).done(function(data) {
                console.log(data);
            });
        }
    });
}

let fillForm = function(info) {
    $("form :input").each(function(){
        let input = $(this);
        let name = input.attr('name');
        try {
            input.val(info[name]);
        } catch(err) {}
    });
};

let importSrc = function(srcId) {
    let srcEndpoint = '/api/sources/'+srcId;
    $.get(srcEndpoint).done(function(src) {
        src['litRes'].push(_id);
        delete src._id;     // mongo error otherwise !!
        $.post(srcEndpoint, src).done(function(data) {
            console.log(data);
        });
        $('#'+srcId).prop("disabled", true);
    });
};

let finishLitRes = function() {
    let infoEndpoint = '/api/info/'+_id;
    $.get(infoEndpoint).done(function(info) {
        info['status'] = 'finished';
        delete info._id;     // mongo error otherwise !!
        $.post(infoEndpoint, info).done(function(data) {
            window.location = '/admin';
        });
    });
}

$(document).ready(function(){
    $.get('/api/info/'+_id).done(function(info) {
        fillForm(info);
    });
});
  