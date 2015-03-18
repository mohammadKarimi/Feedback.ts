/// <reference path="browserinfo/browserinfo.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var phoenix;
(function (phoenix) {
    var feedbackContent = (function () {
        function feedbackContent() {
            this.description = "";
            this.highlighter = "";
            this.overview = "";
            this.submitSuccess = "";
            this.submitFailor = "";
        }
        return feedbackContent;
    })();
    phoenix.feedbackContent = feedbackContent;
    var feedbackOptions = (function (_super) {
        __extends(feedbackOptions, _super);
        function feedbackOptions(url, onStart, onClose, feedbackContent) {
            _super.call(this);
            this.highlightCounter = 1;
            this.documentHeight = window.innerHeight;
            this.documentWidth = window.innerWidth;
            this.html2ConvasSupport = !!window.HTMLCanvasElement;
            this.url = url;
            this.onClose = onClose;
            this.onStart = onStart;
            this.description = feedbackContent.description;
            this.highlighter = feedbackContent.highlighter;
            this.overview = feedbackContent.overview;
            this.submitSuccess = feedbackContent.submitSuccess;
            this.submitFailor = feedbackContent.submitFailor;
        }
        return feedbackOptions;
    })(feedbackContent);
    phoenix.feedbackOptions = feedbackOptions;
    var feedback = (function () {
        function feedback($element, fbOptions) {
            this._postData = browserInfo.getInformation();
            this._$element = $element;
            this._fbOptions = fbOptions;
        }
        feedback.prototype.getf = function () {
            return this._postData;
        };
        return feedback;
    })();
    phoenix.feedback = feedback;
})(phoenix || (phoenix = {}));
//# sourceMappingURL=feedback.js.map
