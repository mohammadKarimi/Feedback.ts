     class browserInfo {
        appCodeName: string = navigator.appCodeName;
        appName: string = navigator.appName;
        appVersion: string = navigator.appVersion;
        cookieEnabled: boolean = navigator.cookieEnabled;
        onLine: boolean = navigator.onLine;
        platform: string = navigator.platform;
        userAgent: string = navigator.userAgent;
        static getInformation(): browserInfo {
            return new this;
        }
    }
