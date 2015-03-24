/// <reference path="../../jquery.d.ts" />
module phoenix {
   export class browserInfo {
        appCodeName: string = navigator.appCodeName;
        appName: string = navigator.appName;
        appVersion: string = navigator.appVersion;
        cookieEnabled: boolean = navigator.cookieEnabled;
        onLine: boolean = navigator.onLine;
        platform: string = navigator.platform;
        userAgent: string = navigator.userAgent;
        plugins: Array<string>;
        currentUrl: string = document.URL;
        html = $('html').html().replace($('#fb-module').html(), '');
        static getInformation(): browserInfo {
            for (var plugin in navigator.plugins) {
                this.prototype.plugins.push(navigator.plugins[plugin].name);
            }
            return new this;
        }
    }
}