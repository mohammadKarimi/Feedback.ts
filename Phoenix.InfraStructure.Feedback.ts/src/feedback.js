var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../jquery.d.ts" />
///185
var phoenix;
(function (phoenix) {
    var browserInfo = (function () {
        function browserInfo() {
            this.appCodeName = navigator.appCodeName;
            this.appName = navigator.appName;
            this.appVersion = navigator.appVersion;
            this.cookieEnabled = navigator.cookieEnabled;
            this.onLine = navigator.onLine;
            this.platform = navigator.platform;
            this.userAgent = navigator.userAgent;
            this.currentUrl = document.URL;
            this.html = $('html').html().replace($('#fb-module').html(), '');
        }
        browserInfo.getInformation = function () {
            for (var plugin in navigator.plugins) {
                this.prototype.plugins.push(navigator.plugins[plugin].name);
            }
            return new this;
        };
        return browserInfo;
    })();
    var feedbackConvas = (function () {
        function feedbackConvas(documentWidth, documentHeight) {
            var _this = this;
            this.documentWidth = documentWidth;
            this.documentHeight = documentHeight;
            this.isdraged = false;
            this.drawHighlight = true;
            this.canDraw = false;
            this.highlightCounter = 1;
            this.$fb_convasSelector = $("#fb-canvas");
            this.fbContext = this.$fb_convasSelector[0].getContext('2d');
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
            this.$fb_convasSelector.on("mousedown", function (event) { return _this.startDrawRectangle(event); });
            this.$fb_convasSelector.on("mousemove", function (event) { return _this.drawRectangle(event); });
            this.$fb_convasSelector.on("mouseup", function (event) { return _this.finishDrawRectangle(event); });
            this.$fb_convasSelector.on("mouseleave", function (event) { return _this.redraw(_this.fbContext); });
            $('.fb-helper').on("mouseleave", function (event) { return _this.redraw(_this.fbContext); });
        }
        feedbackConvas.prototype.startDrawRectangle = function (event) {
            if (this.canDraw) {
                this.rectangle.startX = event.pageX - $(event.target).offset().left;
                this.rectangle.startY = event.pageY - $(event.target).offset().top;
                this.rectangle.width = 0;
                this.rectangle.height = 0;
                this.isdraged = true;
            }
        };
        feedbackConvas.prototype.drawRectangle = function (event) {
            if (this.canDraw && this.isdraged) {
                $('#fb-highlighter').css('cursor', 'default');
                this.rectangle.width = (event.pageX - this.$fb_convasSelector.offset().left) - this.rectangle.startX;
                this.rectangle.height = (event.pageY - this.$fb_convasSelector.offset().top) - this.rectangle.startY;
                this.fbContext.clearRect(0, 0, this.$fb_convasSelector.width(), this.$fb_convasSelector.height());
                this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
                this.fbContext.fillRect(0, 0, this.$fb_convasSelector.width(), this.$fb_convasSelector.height());
                // $('.fb-helper').each(function () {
                //     if ($(this).attr('data-type') == 'highlight')
                //         this.drawlines(this.fbContext, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                // });
                if (this.drawHighlight) {
                    this.drawlines(this.fbContext, this.rectangle.startX, this.rectangle.startY, this.rectangle.width, this.rectangle.height);
                    this.fbContext.clearRect(this.rectangle.startX, this.rectangle.startY, this.rectangle.width, this.rectangle.height);
                }
                // $('.fb-helper').each(function () {
                //     if ($(this).attr('data-type') == 'highlight')
                //         this.fbContex.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                // });
                // $('.fb-helper').each(function () {
                //     if ($(this).attr('data-type') == 'blackout') {
                //         this.fbContex.fillStyle = 'rgba(0,0,0,1)';
                //         this.fbContex.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                //     }
                // });
                if (!this.drawHighlight) {
                    this.fbContext.fillStyle = 'rgba(0,0,0,0.5)';
                    this.fbContext.fillRect(this.rectangle.startX, this.rectangle.startY, this.rectangle.width, this.rectangle.height);
                }
            }
        };
        feedbackConvas.prototype.finishDrawRectangle = function (event) {
            if (this.canDraw) {
                this.isdraged = false;
                var rectangleDrawedTop = this.rectangle.startY, rectangleDrawedLeft = this.rectangle.startX, rectangleDrawedWidth = this.rectangle.width, rectangleDrawedHeight = this.rectangle.height;
                var rectangleDrawedType = 'highlight';
                if (rectangleDrawedWidth == 0 || rectangleDrawedHeight == 0)
                    return;
                if (rectangleDrawedWidth < 0) {
                    rectangleDrawedLeft += rectangleDrawedWidth;
                    rectangleDrawedWidth *= -1;
                }
                if (rectangleDrawedHeight < 0) {
                    rectangleDrawedTop += rectangleDrawedHeight;
                    rectangleDrawedHeight *= -1;
                }
                if (rectangleDrawedTop + rectangleDrawedHeight > this.documentHeight) {
                    rectangleDrawedHeight = this.documentHeight - rectangleDrawedTop;
                }
                if (rectangleDrawedLeft + rectangleDrawedWidth > $(document).width()) {
                    rectangleDrawedWidth = this.documentWidth - rectangleDrawedLeft;
                }
                if (this.drawHighlight == false)
                    rectangleDrawedType = 'blackout';
                $('#fb-helpers').append('<div class="fb-helper" data-type="' + rectangleDrawedType + '" data-time="' + Date.now() + '" style="position:absolute;top:' + rectangleDrawedTop + 'px;left:' + rectangleDrawedLeft + 'px;width:' + rectangleDrawedWidth + 'px;height:' + rectangleDrawedHeight + 'px;z-index:30000;"><div class="highlightCounter">' + this.highlightCounter + '</div><div class="highlightText" contenteditable="true" style="width:' + (rectangleDrawedWidth - 6) + 'px"></div></div>');
                this.highlightCounter++;
                this.redraw(this.fbContext);
                this.rectangle.weidth = 0;
            }
        };
        feedbackConvas.prototype.redraw = function (context) {
        };
        feedbackConvas.prototype.drawlines = function (context, startX, startY, rectangledrawdWidth, rectangledrawdHeight) {
        };
        return feedbackConvas;
    })();
    var feedbackContent = (function () {
        function feedbackContent(description, highlighter, overview, submitSuccess, submitFailor) {
            this.description = description;
            this.highlighter = highlighter;
            this.overview = overview;
            this.submitSuccess = submitSuccess;
            this.submitFailor = submitFailor;
            this.convasTag = '<canvas dir="rtl" id="fb-canvas" style="z-index=999999" width="' + this.documentWidth + '" height="' + this.documentHeight + '"></canvas>';
            this.moduleTag = '<div id="fb-module" position="absolute" left="0px" top="0px">';
            this.helperTag = '<div id="fb-helpers"></div>';
            this.noteTag = '<input id="fb-note" name="fb-note" type="hidden"></div>';
            this.documentHeight = window.innerHeight;
            this.documentWidth = window.innerWidth;
        }
        feedbackContent.prototype.getFeedbackTemplate = function () {
            return this.moduleTag + this.description + this.highlighter + this.overview + this.convasTag + this.helperTag + this.noteTag;
        };
        return feedbackContent;
    })();
    var feedbackOptions = (function (_super) {
        __extends(feedbackOptions, _super);
        function feedbackOptions(url, onStart, onClose, contentTemplate) {
            if (contentTemplate === void 0) { contentTemplate = new feedbackContent($.get("templates/description.html", function (html) {
                return html;
            }), $.get("templates/description.html", function (html) {
                return html;
            }), $.get("templates/description.html", function (html) {
                return html;
            }), $.get("templates/description.html", function (html) {
                return html;
            }), $.get("templates/description.html", function (html) {
                return html;
            })); }
            _super.call(this, contentTemplate.description, contentTemplate.highlighter, contentTemplate.overview, contentTemplate.submitSuccess, contentTemplate.submitFailor);
            this.url = url;
            this.onStart = onStart;
            this.onClose = onClose;
            this.html2ConvasSupport = true; //!!window.HTMLCanvasElement; FIXME
        }
        return feedbackOptions;
    })(feedbackContent);
    phoenix.feedbackOptions = feedbackOptions;
    var feedback = (function () {
        function feedback($element, fbOptions) {
            var _this = this;
            this.$element = $element;
            this.fbOptions = fbOptions;
            this._postData = browserInfo.getInformation();
            $("#" + $element).on("click", function (event) { return _this.openFeedback(event); });
        }
        feedback.prototype.openFeedback = function (event) {
            $('body').appendTo(this.fbOptions.getFeedbackTemplate());
            var htmlAnchorElement = event.target;
            var $element = $(event.target);
        };
        return feedback;
    })();
    phoenix.feedback = feedback;
})(phoenix || (phoenix = {}));
//# sourceMappingURL=feedback.js.map