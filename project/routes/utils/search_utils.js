
function sortArray(array, catagory) {
    array.sort(function(a,b){ 
        let textA = a[catagory].toUpperCase();
        let textB = b[catagory].toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
}

function filterArray(array, catagory, value){
    let result = array.filter(element => element[catagory] == value);
    return result;
}

exports.sortArray = sortArray;
exports.filterArray = filterArray;