(function htmlScript() {
    if (WebViewBridge) {
        WebViewBridge.onMessage = function (message) {
            // Converts the payload in JSON format.
            var jsonData = JSON.parse(message);
            switch (jsonData.func) {
                case "test":
                    map.flyTo({
                        center: [
                            jsonData.args[0],
                            jsonData.args[1]
                        ]
                    });
                    break;
                default:
                    break;
            }
        };
    }
});

(function htmlScript() {
    if (WebViewBridge) {
        WebViewBridge.onMessage = function (message) {
            // Converts the payload in JSON format.
            var jsonData = JSON.parse(message);
            switch (jsonData.func) {
                case "test":
                    map.flyTo({
                        center: [
                            jsonData.args[0],
                            jsonData.args[1]
                        ]
                    });
                    break;
                default:
                    break;
            }
        };
    }
    var location = window.document.location;

    var preventNavigation = function () {
        var originalHashValue = location.hash;

        window.setTimeout(function () {
            location.hash = 'preventNavigation' + ~~(9999 * Math.random());
            location.hash = originalHashValue;
        }, 0);
    };

    window.addEventListener('beforeunload', preventNavigation, false);
    window.addEventListener('unload', preventNavigation, false);
}());