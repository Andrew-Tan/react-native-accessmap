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