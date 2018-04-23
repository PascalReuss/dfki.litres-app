let fillMetricInputs = function() {
    $.get('/api/processes').done(function(data) {
        data.forEach(function(p) {
            let qScoreAttrNames = ['q-applicability', 'q-relevance', 'q-holism'];
            for (let i in qScoreAttrNames){
                let scoreList = [];
                
                
                let count = 0;
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

                // console.log(scoreList);
                
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