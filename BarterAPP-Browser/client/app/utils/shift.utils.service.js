var A = (function () {
    function A () {
    }
    A.prototype.someFunc = function () {
        return A.arrayname.length;
    };
    A.arrayname = ["a", "b", "c"];
    return A
})()
// # sourceMappingURL=shift.utils.js.map
