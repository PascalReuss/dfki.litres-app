let showLinking = function(type, id, enable) {
    let callItemsForPrevPtr = function(id, items) {
        $.get('/api/'+items).done(function(items) {
            items.forEach(function(item) {
                if (item.prev_ptr === id)
                    coloring(item._id, 'item', 'item', enable);
            });
        });
    };
    switch(type) {
        case "src":
            $.get('/api/sres').done(function(sres) {
                sres.forEach(function(sre) {
                    if (sre.sources.indexOf(id) > -1)
                        coloring(sre._id, 'sre', 'src', enable);
                });
            });
            $.get('/api/queries').done(function(queries) {
                queries.forEach(function(q) {
                    if (q.srcs !== undefined && q.srcs.indexOf(id) > -1) {
                        coloring(q._id, 'item', 'src', enable);      
                    }
                });
            });
            $.get('/api/processes').done(function(processes) {
                processes.forEach(function(p) {
                    for (key in p) {
                        if (key === id)
                            coloring(p._id, 'item', 'src', enable);
                    }
                });
            });
            break;
        case "sre":
            $.get('/api/sres/'+id).done(function(sre) {
                sre.sources.forEach(function(srcId) {
                    coloring(srcId, 'src', 'sre', enable);
                });
                coloring(sre.prev_ptr, 'item', 'sre', enable);
            });
            break;
        case "query":
            $.get('/api/sres').done(function(sres) {
                sres.forEach(function(sre) {
                    if (sre.prev_ptr === id)
                        coloring(sre._id, 'sre', 'item', enable);
                });
            });
            $.get('api/queries/'+id).done(function(q) {
                if (q.srcs !== undefined)
                    q.srcs.forEach(function(srcId) {
                        coloring(srcId, 'src', 'item', enable);
                    });
            });
            callItemsForPrevPtr(id, 'queries');
            callItemsForPrevPtr(id, 'processes');
            break;
        case "process":
            $.get('api/processes/'+id).done(function(p) {
                for (key in p) {
                    if (['_id','prev_ptr','proposition','ts','status'].indexOf(key) < 0)
                        coloring(key, 'src', 'item', enable);
                }
            });
            callItemsForPrevPtr(id, 'queries');
            callItemsForPrevPtr(id, 'results');
            break;
        case "result":
            callItemsForPrevPtr(id, 'queries');
            break;
    }
};
let coloring = function(id, typeInit, typeTarget, enable) {
    let colorHighlight = {
        src: 'orange',
        sre: '#e5cc4b',
        item: '#9de278'      // process / query / result
    };
    let colorNormal = {
        src: '#5bc0de',
        sre: '#337ab7',
        item: '#f5f5f5'     // process / query / result
    }
    if (enable)
        $('#'+id).css('background-color',colorHighlight[typeTarget]);
    else
        $('#'+id).css('background-color',colorNormal[typeInit]);
}

let fillMetricInputs = function() {
    $.get('/api/processes').done(function(data) {
        data.forEach(function(p) {
            let qScoreAttrNames = ['q-applicability', 'q-relevance', 'q-holism'];
            for (let i in qScoreAttrNames){
                let scoreList = [],
                    count = 0;
                for (let key in p) {
                    count++;
                    if (p[key].hasOwnProperty(qScoreAttrNames[i]))
                        scoreList.push(parseInt(p[key][qScoreAttrNames[i]]));
                    if (count === Object.size(p)) {
                        if (scoreList.length > 0) {
                            let average = function(data) {
                                let sum = data.reduce(function(sum, value) {
                                  return sum + value;
                                }, 0);
                                return sum / data.length;
                            }
                            let avg = average(scoreList).toFixed(1);
                            let std = Math.sqrt(average(scoreList.map(function(num) {
                                return num - avg;
                            }))).toFixed(2);
                            $('#'+p._id+'-'+qScoreAttrNames[i]).val(avg+'  \u00B1'+std);
                        } else {
                            $('#'+p._id+'-'+qScoreAttrNames[i]).val('-');
                        }
                    }
                }                
            }
        });
    });
    $.get('/api/results').done(function(data) {
        data.forEach(function(r) {
            let qScoreAttrNames = ['q-researchEffort', 'q-novelty', 'q-qor'];
            qScoreAttrNames.forEach(function(scoreAttrName){
                $('#'+r._id+'-'+scoreAttrName).val(r[scoreAttrName]);
            });
        });
    });
};


Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function() {
    fillMetricInputs();
});