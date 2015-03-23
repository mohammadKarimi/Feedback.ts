class browserInfo {
    appCodeName: string = navigator.appCodeName;
    appName: string = navigator.appName;
    appVersion: string = navigator.appVersion;
    cookieEnabled: boolean = navigator.cookieEnabled;
    onLine: boolean = navigator.onLine;
    platform: string = navigator.platform;
    userAgent: string = navigator.userAgent;
    plugins: Array<string>;
    static getInformation(): browserInfo {
        for (var plugin in navigator.plugins) {
            this.prototype.plugins.push(plugin.name);
        }
        return new this;
    }
}