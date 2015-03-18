var browserInfo = (function () {
    function browserInfo() {
        this.appCodeName = navigator.appCodeName;
        this.appName = navigator.appName;
        this.appVersion = navigator.appVersion;
        this.cookieEnabled = navigator.cookieEnabled;
        this.onLine = navigator.onLine;
        this.platform = navigator.platform;
        this.userAgent = navigator.userAgent;
    }
    browserInfo.getInformation = function () {
        return new this;
    };
    return browserInfo;
})();
//# sourceMappingURL=browserInfo.js.map
