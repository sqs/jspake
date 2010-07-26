

var crypto = {};

crypto.pake2plus = function pake2plus(G, V, U, my) {
    var that = {};
    my = my || {};

    my.G = G;
    my.V = V;
    my.U = U;

    that.toString = function() {
        return "pake2plus{G: " + G + ", V: " + V + ", U: " + U + "}";
    };

    return that;
};

crypto.pake2plus.client = function pake2plus_client(G, V, U, my) {
    var that;
    my = my || {};
    
    that = crypto.pake2plus(G, V, U, my);

    that.toString = function() {
        var superToString = that.toString;
        return function () {
            return "pake2plus.client{super: " + superToString() + "}";
        };
    }();

    return that;
};

crypto.pake2plus.server = function pake2plus_server(G, V, U, my) {
    var that;
    my = my || {};

    that = crypto.pake2plus(G, V, U, my);

    that.toString = function() {
        var superToString = that.toString;
        return function () {
            return "pake2plus.server{super: " + superToString() + "}";
        };
    }();

    return that;
};
