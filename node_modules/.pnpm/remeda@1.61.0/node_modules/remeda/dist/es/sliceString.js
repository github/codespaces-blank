export var sliceString = function (indexStart, indexEnd) {
    return function (data) {
        return data.slice(indexStart, indexEnd);
    };
};
