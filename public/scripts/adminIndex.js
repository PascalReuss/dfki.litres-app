let _id = '5ae1a3553eac40cd73e09bcc';

let updateInfo = function() {
    let info = {},
        keys = ['researcher','supervisor','title','research-Question'];
    keys.forEach(function(key, i) {
        info[key] = $('form :input[name='+key+']').val();
        if (i === keys.length - 1) {
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

$(document).ready(function(){
    $.get('/api').done(function(info) {
        fillForm(info);
    });
});
  