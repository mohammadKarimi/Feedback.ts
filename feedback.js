var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../jquery.d.ts" />
var phoenix;
(function (phoenix) {
    (function (fbInitializer) {
        fbInitializer[fbInitializer["fbContent"] = 0] = "fbContent";
        fbInitializer[fbInitializer["fbCanvas"] = 1] = "fbCanvas";
        fbInitializer[fbInitializer["all"] = 2] = "all";
    })(phoenix.fbInitializer || (phoenix.fbInitializer = {}));
    var fbInitializer = phoenix.fbInitializer;

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
                //this.prototype.platform.push(navigator.plugins[plugin].name);
            }
            return new this;
        };
        return browserInfo;
    })();
    var feedbackCanvas = (function () {
        function feedbackCanvas(documentWidth, documentHeight) {
            this.documentWidth = documentWidth;
            this.documentHeight = documentHeight;
            this.isdraged = false;
            this.drawHighlight = true;
            this.canDraw = false;
            this.rectangle = { startX: 0, startY: 0, width: 0, height: 0 };
            this.highlightCounter = 1;
        }
        feedbackCanvas.prototype.initializeCanvas = function () {
            var _this = this;
            this.$fb_convasSelector = $("#fb-canvas");
            this.fbContext = this.$fb_convasSelector[0].getContext('2d');
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
            this.$fb_convasSelector.on("mousedown", function (event) {
                return _this.startDrawRectangle(event);
            });
            this.$fb_convasSelector.on("mousemove", function (event) {
                return _this.drawRectangle(event);
            });
            this.$fb_convasSelector.on("mouseup", function (event) {
                return _this.finishDrawRectangle(event);
            });
            this.$fb_convasSelector.on("mouseleave", function (event) {
                return _this.redraw();
            });
            $(document).on("mouseenter mouseleave", ".fb-helper", function (event) {
                return _this.setBlackoutTransparetn(event);
            });
            $(document).on("click", ".fb-rectangle-close", function (el) {
                return _this.removeDrawedRectangle(el);
            });
        };

        feedbackCanvas.prototype.startDrawRectangle = function (event) {
            if (this.canDraw) {
                this.rectangle.startX = event.pageX - $(event.target).offset().left;
                this.rectangle.startY = event.pageY - $(event.target).offset().top;
                this.rectangle.width = 0;
                this.rectangle.height = 0;
                this.isdraged = true;
            }
        };
        feedbackCanvas.prototype.drawRectangle = function (event) {
            if (this.canDraw && this.isdraged) {
                $('#fb-highlighter').css('cursor', 'default');
                this.rectangle.width = (event.pageX - this.$fb_convasSelector.offset().left) - this.rectangle.startX;
                this.rectangle.height = (event.pageY - this.$fb_convasSelector.offset().top) - this.rectangle.startY;
                this.fbContext.clearRect(0, 0, this.$fb_convasSelector.width(), this.$fb_convasSelector.height());
                this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
                this.fbContext.fillRect(0, 0, this.$fb_convasSelector.width(), this.$fb_convasSelector.height());
                if (this.drawHighlight) {
                    this.fbContext.clearRect(this.rectangle.startX, this.rectangle.startY, this.rectangle.width, this.rectangle.height);
                } else {
                    this.fbContext.fillStyle = 'rgba(0,0,0,0.5)';
                    this.fbContext.fillRect(this.rectangle.startX, this.rectangle.startY, this.rectangle.width, this.rectangle.height);
                }
                this.redraw();
            }
        };
        feedbackCanvas.prototype.finishDrawRectangle = function (event) {
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
                var bubble = '<div class="bubble" contenteditable="true" style="width:' + (rectangleDrawedWidth - 6) + 'px"></div>';
                if (this.drawHighlight == false) {
                    rectangleDrawedType = 'blackout';
                    bubble = '';
                }
                $('#fb-helpers').append('<div class="fb-helper" data-type="' + rectangleDrawedType + '" data-time="' + Date.now() + '" style="position:absolute;top:' + rectangleDrawedTop + 'px;left:' + rectangleDrawedLeft + 'px;width:' + rectangleDrawedWidth + 'px;height:' + rectangleDrawedHeight + 'px;z-index:30000;">' + '<div class="fb-rectangle-close"></div>' + '<div class="highlightCounter">' + this.highlightCounter + '</div>' + bubble + '</div>');
                this.highlightCounter++;
                this.redraw();
            }
        };
        feedbackCanvas.prototype.removeDrawedRectangle = function (el) {
            this.highlightCounter--;
            var numberSelect = parseInt($(el.target).parent().find(".highlightCounter").html());
            $(el.target).parent().remove();
            this.clearContext();
            this.redraw();
            $.each($(".highlightCounter"), function (index, item) {
                var number = parseInt($(this).html());
                if (number >= numberSelect) {
                    $(this).html((number - 1).toString());
                }
            });
        };
        feedbackCanvas.prototype.clearContext = function () {
            this.fbContext.clearRect(0, 0, this.documentWidth, this.documentHeight);
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
        };
        feedbackCanvas.prototype.redraw = function (fbContext) {
            if (typeof fbContext === "undefined") { fbContext = this.fbContext; }
            $('.fb-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight') {
                    fbContext.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                } else {
                    fbContext.fillStyle = 'rgba(0,0,0,1)';
                    fbContext.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                }
            });
        };
        feedbackCanvas.prototype.setBlackoutTransparetn = function (event, fbContext) {
            if (typeof fbContext === "undefined") { fbContext = this.fbContext; }
            if (this.isdraged)
                return;
            if (event.type === 'mouseenter') {
                if ($(event.target).attr('data-type') == 'blackout') {
                    fbContext.clearRect(0, 0, this.documentWidth, this.documentHeight);
                    fbContext.fillStyle = 'rgba(102,102,102,0.5)';
                    fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);

                    $('.fb-helper').each(function () {
                        if ($(this).attr('data-type') == 'highlight')
                            fbContext.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                    });

                    fbContext.clearRect(parseInt($(event.target).css('left'), 10), parseInt($(event.target).css('top'), 10), $(event.target).width(), $(event.target).height());

                    fbContext.fillStyle = 'rgba(0,0,0,0.75)';

                    fbContext.fillRect(parseInt($(event.target).css('left'), 10), parseInt($(event.target).css('top'), 10), $(event.target).width(), $(event.target).height());

                    var ignore = $(event.target).attr('data-time');
                    $('.fb-helper').each(function () {
                        if ($(this).attr('data-time') == ignore)
                            return true;
                        if ($(this).attr('data-type') == 'blackout') {
                            fbContext.fillStyle = 'rgba(0,0,0,1)';
                            fbContext.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                        }
                    });
                }
            } else {
                $(event.target).css('z-index', '30000');
                if ($(event.target).attr('data-type') == 'blackout') {
                    this.redraw();
                }
            }
        };
        return feedbackCanvas;
    })();
    var feedbackContent = (function (_super) {
        __extends(feedbackContent, _super);
        function feedbackContent(url, description, highlighter, overview, submitSuccess, submitError, browserNotSupport, onClose) {
            _super.call(this, window.innerWidth, window.innerHeight);
            this.url = url;
            this.description = description;
            this.highlighter = highlighter;
            this.overview = overview;
            this.submitSuccess = submitSuccess;
            this.submitError = submitError;
            this.browserNotSupport = browserNotSupport;
            this.onClose = onClose;
            this.convasTag = '<canvas dir="rtl" id="fb-canvas" style="z-index=999999" width="' + window.innerWidth + '" height="' + window.innerHeight + '"></canvas>';
            this.moduleTag = '<div id="fb-module" position="absolute" left="0px" top="0px">';
            this.helperTag = '<div id="fb-helpers"></div>';
            this.noteTag = '<input id="fb-note" name="fb-note" type="hidden"></div>';
            this.endTag = '</div>';
            this.browserInfo = browserInfo.getInformation();
            this.documentHeight = window.innerHeight;
            this.documentWidth = window.innerWidth;
            this.description = $.get(this.description, function (html) {
                return html;
            });
            this.highlighter = $.get(this.highlighter, function (html) {
                return html;
            });
            this.overview = $.get(this.overview, function (html) {
                return html;
            });
            this.submitSuccess = $.get(this.submitSuccess, function (html) {
                return html;
            });
            this.submitError = $.get(this.submitError, function (html) {
                return html;
            });
            this.browserNotSupport = $.get(this.browserNotSupport, function (html) {
                return html;
            });
        }
        feedbackContent.prototype.initializeContent = function () {
            var _this = this;
            $(document).on("click", "#fb-description-next", function (event) {
                return _this.nextToHighlighter();
            });
            $(document).on("click", "#fb-highlighter-back", function (event) {
                return _this.backToDescription();
            });
            $(document).on("click", "#fb-highlighter-next", function (event) {
                return _this.nextToOverview();
            });
            $(document).on('click', '.fb-sethighlight', function () {
                return _this.setHighlight();
            });
            $(document).on('click', '.fb-setblackout', function () {
                return _this.setBlackout();
            });
            $(document).on('click', '.fb-module-close', function () {
                return _this.closefbModule();
            });
            $(document).on('click', '.fb-close-btn', function () {
                return _this.closefbModule();
            });
            $(document).on('keyup', function (event) {
                return _this.keyUpCapture(event);
            });
            $(document).on('mousedown', '#fb-highlighter', function (event) {
                return _this.draggableHighlighterbox(event);
            });
            $(document).on('mouseup', '#fb-highlighter', function (event) {
                return _this.removeDraggableHighlighterbox(event);
            });
            $(document).on('mouseup', '#fb-overview-back', function (event) {
                return _this.backToHighlighter();
            });
            $(document).on('click', "#fb-page-info", function () {
                return _this.according_fb_page_info();
            });
            $(document).on('click', "#fb-browser-info", function () {
                return _this.according_fb_browser_info();
            });
            $(document).on('click', "#fb-page-structure", function () {
                return _this.according_fb_page_structure();
            });
            $(document).on('click', "#fb-submit", function (el) {
                return _this.submitFeedback();
            });
        };
        feedbackContent.prototype.closefbModule = function () {
            this.canDraw = false;
            $(document).off('click', '.fb-close-btn');
            $(document).off('click', "#fb-browser-info");
            $(document).off('click', "#fb-page-structure");
            $(document).off('mouseup', '#fb-overview-back');
            $(document).off('click', "#fb-page-info");
            $(document).off('click', "#fb-description-next");
            $(document).off('click', "#fb-highlighter-back");
            $(document).off('click', "#fb-highlighter-next");
            $(document).off('click', ".fb-sethighlight");
            $(document).off('click', ".fb-setblackout");
            $(document).off('click', ".fb-module-close");
            $(document).off('mouseup keyup');
            $(document).off('mousedown mousemove mouseup mouseleave', "#fb-canvas");
            $('[data-highlighted="true"]').removeAttr('data-highlight-id').removeAttr('data-highlighted');
            $(document).off('mouseenter mouseleave', ".fb-helper");
            $(document).off("click", ".fb-rectangle-close");
            $(document).off('mouseleave', 'body');
            $(document).off('mousedown mouseup', '#fb-highlighter');
            $('#fb-module').remove();
            this.onClose.call(this);
        };
        feedbackContent.prototype.keyUpCapture = function (event) {
            if (event.keyCode == 27) {
                this.closefbModule();
            }
        };
        feedbackContent.prototype.nextToHighlighter = function () {
            if ($('#fb-note').val().length == 0) {
                $('#fb-note').addClass('fb-description-error');
                return;
            }
            $('#fb-note').removeClass('fb-description-error');
            this.canDraw = true;
            $('#fb-canvas').css('cursor', 'crosshair');
            $('#fb-helpers').show();
            $('#fb-description').hide();
            $('#fb-highlighter').show();
        };
        feedbackContent.prototype.backToDescription = function () {
            this.canDraw = false;
            $('#fb-canvas').css('cursor', 'default');
            $('#fb-highlighter').hide();
            $('#fb-description-error').hide();
            $('#fb-description').show();
        };
        feedbackContent.prototype.draggableHighlighterbox = function (event) {
            var $fb_highlighter = $(event.target).addClass('fb-draggable'), drag_h = $fb_highlighter.outerHeight(), drag_w = $fb_highlighter.outerWidth(), pos_y = $fb_highlighter.offset().top + drag_h - event.pageY, pos_x = $fb_highlighter.offset().left + drag_w - event.pageX;
            $fb_highlighter.css('z-index', 40000).parent().on('mousemove', function (e) {
                var _top = e.pageY + pos_y - drag_h;
                var _left = e.pageX + pos_x - drag_w;
                var _bottom = drag_h - e.pageY;
                var _right = drag_w - e.pageX;
                if (_left < 0)
                    _left = 0;
                if (_top < 0)
                    _top = 0;
                if (_right > $(window).width())
                    _left = $(window).width() - drag_w;
                if (_left > $(window).width() - drag_w)
                    _left = $(window).width() - drag_w;
                if (_bottom > $(document).height())
                    _top = $(document).height() - drag_h;
                if (_top > $(document).height() - drag_h)
                    _top = $(document).height() - drag_h;
                $('.fb-draggable').offset({
                    top: _top,
                    left: _left
                }).on("mouseup", function () {
                    $(this).removeClass('fb-draggable');
                });
            });
            event.preventDefault();
        };
        feedbackContent.prototype.removeDraggableHighlighterbox = function (event) {
            $(event.target).removeClass('fb-draggable');
            $(event.target).parents().off('mousemove mousedown');
        };
        feedbackContent.prototype.setHighlight = function () {
            this.drawHighlight = true;
            $('.fb-sethighlight').addClass('fb-active');
            $('.fb-setblackout').removeClass('fb-active');
        };
        feedbackContent.prototype.setBlackout = function () {
            this.drawHighlight = false;
            $('.fb-setblackout').addClass('fb-active');
            $('.fb-sethighlight').removeClass('fb-active');
        };
        feedbackContent.prototype.backToHighlighter = function () {
            this.canDraw = true;
            $('#fb-canvas').css('cursor', 'crosshair');
            $('#fb-overview').hide();
            $('#fb-helpers').show();
            $('#fb-highlighter').show();
            $('#fb-overview-error').hide();
        };
        feedbackContent.prototype.nextToOverview = function () {
            this.canDraw = false;
            $('#fb-screenshot').html('');
            $("#loading-screenshot").fadeIn();
            $('#fb-canvas').css('cursor', 'default');
            $('#fb-highlighter').hide();
            $('textarea#fb-overview-note').val($('#fb-note').val());
            $("#browserInfo-appCodeName").html(this.browserInfo.appCodeName);
            $("#browserInfo-appName").html(this.browserInfo.appName);
            $("#browserInfo-appVersion").html(this.browserInfo.appVersion);
            $("#browserInfo-cookieEnabled").html(this.browserInfo.cookieEnabled.toString());
            $("#browserInfo-onLine").html(this.browserInfo.onLine.toString());
            $("#browserInfo-platform").html(this.browserInfo.platform);
            $("#browserInfo-userAgent").html(this.browserInfo.userAgent);
            $("#fb-page-infodetail").html('').append(this.browserInfo.currentUrl);
            $("#fb-html-infodetail").text(this.browserInfo.html);
            this.browserInfo.screenSnapshot = this.html2Canvas(this.documentWidth);
        };
        feedbackContent.prototype.html2Canvas = function (documentWidth) {
            var sy = $(document).scrollTop(), wh = $(window).height();
            var img;

            html2canvas($('body'), {
                onrendered: function (canvas) {
                    var _canvas = $('<canvas id="fb-canvas-tmp" dir="rtl" width="' + documentWidth + '" height="' + wh + '"/>').hide().appendTo('body');
                    var _ctx = _canvas.get(0).getContext('2d');
                    _ctx.fillStyle = "#000";
                    _ctx.font = "bold 16px Arial";
                    _ctx.drawImage(canvas, 0, sy, documentWidth, wh, 0, 0, documentWidth, wh);
                    img = _canvas.get(0).toDataURL();
                    $(document).scrollTop(sy);
                    $('#fb-canvas-tmp').remove();
                    $('#fb-overview').show();
                    setTimeout(function () {
                        $('#fb-screenshot').html('').append('<a href="' + img + '" target="_blank" ><img class="fb-screenshot fb-screenshot-border fb-screenshot-fadeIn" src="' + img + '" /></a>');
                        $("#loading-screenshot").hide();
                    }, 1200);
                }
            });
            return img;
        };
        feedbackContent.prototype.according_fb_page_info = function () {
            var el = $("#fb-page-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        };
        feedbackContent.prototype.according_fb_browser_info = function () {
            var el = $("#fb-browser-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        };
        feedbackContent.prototype.according_fb_page_structure = function () {
            var el = $("#fb-html-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        };
        feedbackContent.prototype.submitFeedback = function () {
            this.canDraw = false;
            if ($('#fb-overview-note').val().length <= 0) {
                $('#fb-overview-note').addClass('fb-description-error');
                return;
            }
            $.ajax({
                url: this.url,
                dataType: 'json',
                type: 'POST',
                data: { feedback: { browserInfo: JSON.stringify(this.browserInfo), note: $('#fb-overview-note').val() } },
                success: function () {
                    $('#fb-overview').hide();
                    $('#fb-submit-success').fadeIn();
                },
                error: function () {
                    $('#fb-overview').hide();
                    $('#fb-submit-error').fadeIn();
                }
            });
        };

        feedbackContent.prototype.getfbTemplate = function (html2canvasSupport) {
            if (html2canvasSupport)
                return {
                    isSuccessfull: true,
                    result: this.moduleTag + this.description.responseText + this.highlighter.responseText + this.overview.responseText + this.submitSuccess.responseText + this.submitError.responseText + this.convasTag + this.helperTag + this.noteTag + this.endTag
                };
            return {
                isSuccessfull: false,
                result: this.moduleTag + this.browserNotSupport.responseText + this.endTag
            };
        };
        return feedbackContent;
    })(feedbackCanvas);

    var feedbackOptions = (function () {
        function feedbackOptions(onStart, onClose, url, contentTemplate) {
            if (typeof onStart === "undefined") { onStart = function () {
            }; }
            if (typeof onClose === "undefined") { onClose = function () {
            }; }
            if (typeof url === "undefined") { url = "localhost/send"; }
            if (typeof contentTemplate === "undefined") { contentTemplate = {
                description: "templates/fa-Ir/description.html",
                highlighter: "templates/fa-Ir/highlighter.html",
                overview: "templates/fa-Ir/overview.html",
                submitSuccess: "templates/fa-Ir/submitSuccess.html",
                submitError: "templates/fa-Ir/submitError.html",
                browserNotSupport: "templates/fa-Ir/browserNotSupport.html"
            }; }
            this.onStart = onStart;
            this.onClose = onClose;
            this.url = url;
            this.contentTemplate = contentTemplate;
            this.html2ConvasSupport = true;
            this.fb_Content = new feedbackContent(this.url, this.contentTemplate.description, this.contentTemplate.highlighter, this.contentTemplate.overview, this.contentTemplate.submitSuccess, this.contentTemplate.submitError, this.contentTemplate.browserNotSupport, this.onClose);
        }
        feedbackOptions.prototype.getfbTemplate = function () {
            return this.fb_Content.getfbTemplate(this.html2ConvasSupport);
        };
        feedbackOptions.prototype.initialize = function (fb_initializer) {
            switch (fb_initializer) {
                case 2 /* all */: {
                    this.fb_Content.initializeContent();
                    this.fb_Content.initializeCanvas();
                    break;
                }
                case 0 /* fbContent */: {
                    this.fb_Content.initializeContent();
                    break;
                }
                case 1 /* fbCanvas */: {
                    this.fb_Content.initializeCanvas();
                    break;
                }
                default: {
                    this.fb_Content.initializeContent();
                    break;
                }
            }
        };
        return feedbackOptions;
    })();
    phoenix.feedbackOptions = feedbackOptions;
    var feedback = (function () {
        function feedback($element, feedbackOptions) {
            var _this = this;
            this.$element = $element;
            this.feedbackOptions = feedbackOptions;
            $("#" + $element).on("click", function (event) {
                return _this.openfb(event);
            });
        }
        feedback.prototype.openfb = function (event) {
            this.feedbackOptions.onStart.call(this);
            var factoryResult = this.feedbackOptions.getfbTemplate();
            $('body').append(factoryResult.result);
            if (factoryResult.isSuccessfull) {
                this.feedbackOptions.initialize(2 /* all */);
            } else {
                this.feedbackOptions.initialize(0 /* fbContent */);
            }
            var htmlAnchorElement = event.target;
            var $element = $(event.target);
        };
        return feedback;
    })();
    phoenix.feedback = feedback;
})(phoenix || (phoenix = {}));
//# sourceMappingURL=feedback.js.map
