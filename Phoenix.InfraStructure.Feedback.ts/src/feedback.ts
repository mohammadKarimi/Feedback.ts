/// <reference path="../jquery.d.ts" />
module phoenix {

    interface rectangleObject {
        startX: number;
        startY: number;
        width: number;
        height: number
    }
    export interface actionResult<T> {
        isSuccessfull: boolean;
        result: T;
    }
    export enum fbInitializer {
        fbContent,
        fbCanvas,
        all
    }

    class browserInfo {
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
        screenSnapshot: any;
        static getInformation(): browserInfo {
            for (var plugin in navigator.plugins) {
                //this.prototype.platform.push(navigator.plugins[plugin].name);
            }
            return new this;
        }
    }
    class feedbackCanvas {
        constructor(public documentWidth: number, public documentHeight: number) { }
        public initializeCanvas() {
            this.$fb_convasSelector = $("#fb-canvas");
            this.fbContext = this.$fb_convasSelector[0].getContext('2d');
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
            this.$fb_convasSelector.on("mousedown", (event: JQueryEventObject) => this.startDrawRectangle(event));
            this.$fb_convasSelector.on("mousemove", (event: JQueryEventObject) => this.drawRectangle(event));
            this.$fb_convasSelector.on("mouseup", (event: JQueryEventObject) => this.finishDrawRectangle(event));
            this.$fb_convasSelector.on("mouseleave", (event: JQueryEventObject) => this.redraw());
            $(document).on("mouseenter mouseleave", ".fb-helper", (event: JQueryEventObject) => this.setBlackoutTransparetn(event));
            $(document).on("click", ".fb-rectangle-close", (el: JQuery) => this.removeDrawedRectangle(el));

        }
        public fbContext: any;
        public isdraged: boolean = false;
        public drawHighlight: boolean = true;
        public canDraw: boolean = false;

        private $fb_convasSelector: any;
        private rectangle: rectangleObject = { startX: 0, startY: 0, width: 0, height: 0 };
        private highlightCounter: number = 1;

        private startDrawRectangle(event): void {
            if (this.canDraw) {
                this.rectangle.startX = event.pageX - $(event.target).offset().left;
                this.rectangle.startY = event.pageY - $(event.target).offset().top;
                this.rectangle.width = 0;
                this.rectangle.height = 0;
                this.isdraged = true;
            }
        }
        private drawRectangle(event): void {
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
        }
        private finishDrawRectangle(event): void {
            if (this.canDraw) {
                this.isdraged = false;
                var rectangleDrawedTop: number = this.rectangle.startY,
                    rectangleDrawedLeft: number = this.rectangle.startX,
                    rectangleDrawedWidth: number = this.rectangle.width,
                    rectangleDrawedHeight: number = this.rectangle.height;
                var rectangleDrawedType: string = 'highlight';

                if (rectangleDrawedWidth == 0 || rectangleDrawedHeight == 0) return;

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
                $('#fb-helpers').append('<div class="fb-helper" data-type="' + rectangleDrawedType + '" data-time="' + Date.now()
                    + '" style="position:absolute;top:' + rectangleDrawedTop + 'px;left:' + rectangleDrawedLeft
                    + 'px;width:' + rectangleDrawedWidth + 'px;height:' + rectangleDrawedHeight + 'px;z-index:30000;">'
                    + '<div class="fb-rectangle-close"></div>' +
                    '<div class="highlightCounter">' + this.highlightCounter + '</div>' +
                    bubble
                    + '</div>');
                this.highlightCounter++;
                this.redraw();
            }
        }
        private removeDrawedRectangle(el): void {
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
        }
        private clearContext(): void {
            this.fbContext.clearRect(0, 0, this.documentWidth, this.documentHeight);
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
        }
        private redraw(fbContext: any = this.fbContext): void {
            $('.fb-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight') {
                    fbContext.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                } else {
                    fbContext.fillStyle = 'rgba(0,0,0,1)';
                    fbContext.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                   }
            });
        }
        private setBlackoutTransparetn(event: JQueryEventObject, fbContext: any= this.fbContext): void {
            if (this.isdraged)
                return;
            if (event.type === 'mouseenter') {
                if ($(event.target).attr('data-type') == 'blackout') {
                    fbContext.clearRect(0, 0, this.documentWidth, this.documentHeight);
                    fbContext.fillStyle = 'rgba(102,102,102,0.5)';
                    fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);

                    $('.fb-helper').each(function () {
                        if ($(this).attr('data-type') == 'highlight')
                            fbContext.clearRect(parseInt($(this).css('left'), 10),
                                parseInt($(this).css('top'), 10),
                                $(this).width(),
                                $(this).height());
                    });

                    fbContext.clearRect(parseInt($(event.target).css('left'), 10),
                        parseInt($(event.target).css('top'), 10),
                        $(event.target).width(),
                        $(event.target).height());

                    fbContext.fillStyle = 'rgba(0,0,0,0.75)';

                    fbContext.fillRect(parseInt($(event.target).css('left'), 10),
                        parseInt($(event.target).css('top'), 10),
                        $(event.target).width(),
                        $(event.target).height());

                    var ignore = $(event.target).attr('data-time');
                    $('.fb-helper').each(function () {
                        if ($(this).attr('data-time') == ignore)
                            return true;
                        if ($(this).attr('data-type') == 'blackout') {
                            fbContext.fillStyle = 'rgba(0,0,0,1)';
                            fbContext.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                                  }
                    });
                }
            }
            else {
                $(event.target).css('z-index', '30000');
                if ($(event.target).attr('data-type') == 'blackout') {
                    this.redraw();
                }
            }
        }
    }
    class feedbackContent extends feedbackCanvas {
        private convasTag: any = '<canvas dir="rtl" id="fb-canvas" style="z-index=999999" width="' + $(document).width() + '" height="' + $(document).height() + '"></canvas>';
        private moduleTag: any = '<div id="fb-module" position="absolute" left="0px" top="0px">';
        private helperTag: any = '<div id="fb-helpers"></div>';
        private noteTag: any = '<input id="fb-note" name="fb-note" type="hidden"></div>';
        private endTag: any = '</div>';
        private browserInfo: browserInfo = browserInfo.getInformation();
        public documentHeight: number = $(document).height();
        public documentWidth: number = $(document).width();

        constructor(
            private url: string,
            public description: any,
            public highlighter: any,
            public overview: any,
            public submitSuccess: any,
            public submitError: any,
            public browserNotSupport: any,
            public onClose: () => void) {
            super($(document).width(), $(document).height());
            this.description = $.get(this.description, function (html) { return html; });
            this.highlighter = $.get(this.highlighter, function (html) { return html; });
            this.overview = $.get(this.overview, function (html) { return html; });
            this.submitSuccess = $.get(this.submitSuccess, function (html) { return html; });
            this.submitError = $.get(this.submitError, function (html) { return html; });
            this.browserNotSupport = $.get(this.browserNotSupport, function (html) { return html; });
        }

        public initializeContent(): void {
            $(document).on("click", "#fb-description-next", (event: JQueryEventObject) => this.nextToHighlighter());
            $(document).on("click", "#fb-highlighter-back", (event: JQueryEventObject) => this.backToDescription());
            $(document).on("click", "#fb-highlighter-next", (event: JQueryEventObject) => this.nextToOverview());
            $(document).on('click', '.fb-sethighlight', () => this.setHighlight());
            $(document).on('click', '.fb-setblackout', () => this.setBlackout());
            $(document).on('click', '.fb-module-close', () => this.closefbModule());
            $(document).on('click', '.fb-close-btn', () => this.closefbModule());
            $(document).on('keyup', (event: JQueryEventObject) => this.keyUpCapture(event));
            $(document).on('mousedown', '#fb-highlighter', (event: JQueryEventObject) => this.draggableHighlighterbox(event));
            $(document).on('mouseup', '#fb-highlighter', (event: JQueryEventObject) => this.removeDraggableHighlighterbox(event));
            $(document).on('mouseup', '#fb-overview-back', (event: JQueryEventObject) => this.backToHighlighter());
            $(document).on('click', "#fb-page-info", () => this.according_fb_page_info());
            $(document).on('click', "#fb-browser-info", () => this.according_fb_browser_info());
            $(document).on('click', "#fb-page-structure", () => this.according_fb_page_structure());
            $(document).on('click', "#fb-submit", (el: JQuery) => this.submitFeedback());
        }
        private closefbModule() {
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
        }
        private keyUpCapture(event): void {
            if (event.keyCode == 27) {
                this.closefbModule();
            }
        }
        private nextToHighlighter(): void {
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
        }
        private backToDescription(): void {
            this.canDraw = false;
            $('#fb-canvas').css('cursor', 'default');
            $('#fb-highlighter').hide();
            $('#fb-description-error').hide();
            $('#fb-description').show();
        }
        private draggableHighlighterbox(event: JQueryEventObject): void {
            var $fb_highlighter = $(event.target).addClass('fb-draggable'),
                drag_h = $fb_highlighter.outerHeight(),
                drag_w = $fb_highlighter.outerWidth(),
                pos_y = $fb_highlighter.offset().top + drag_h - event.pageY,
                pos_x = $fb_highlighter.offset().left + drag_w - event.pageX;
            $fb_highlighter.css('z-index', 40000).parent().on('mousemove', function (e) {
                var _top = e.pageY + pos_y - drag_h;
                var _left = e.pageX + pos_x - drag_w;
                var _bottom = drag_h - e.pageY;
                var _right = drag_w - e.pageX;
                if (_left < 0) _left = 0;
                if (_top < 0) _top = 0;
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
        }
        private removeDraggableHighlighterbox(event) {
            $(event.target).removeClass('fb-draggable');
            $(event.target).parents().off('mousemove mousedown');
        }
        private setHighlight(): void {
            this.drawHighlight = true;
            $('.fb-sethighlight').addClass('fb-active');
            $('.fb-setblackout').removeClass('fb-active');
        }
        private setBlackout(): void {
            this.drawHighlight = false;
            $('.fb-setblackout').addClass('fb-active');
            $('.fb-sethighlight').removeClass('fb-active');
        }
        private backToHighlighter(): void {
            this.canDraw = true;
            $('#fb-canvas').css('cursor', 'crosshair');
            $('#fb-overview').hide();
            $('#fb-helpers').show();
            $('#fb-highlighter').show();
            $('#fb-overview-error').hide();
        }
        private nextToOverview(): void {
            $('html, body').scrollTop(0);
            this.canDraw = false;
            $('#fb-screenshot').html('')
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
            this.browserInfo.screenSnapshot = this.html2Canvas(this.documentWidth,this.documentHeight);
        }
        private html2Canvas(documentWidth: number, docoumentheight:number): any {
            var sy = $(document).scrollTop();
            var img;
            html2canvas($('body'), {
                onrendered: function (canvas) {
                    var _canvas = $('<canvas id="fb-canvas-tmp" dir="rtl" width="' + documentWidth + '" height="' + docoumentheight + '"/>').hide().appendTo('body');
                    var _ctx = _canvas.get(0).getContext('2d');
                    _ctx.fillStyle = "#000";
                    _ctx.font = "bold 16px Arial";
                    _ctx.drawImage(canvas, 0, sy, documentWidth, docoumentheight, 0, 0, documentWidth, docoumentheight);
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
        }
        private according_fb_page_info(): void {
            var el = $("#fb-page-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        }
        private according_fb_browser_info(): void {
            var el = $("#fb-browser-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        }
        private according_fb_page_structure(): void {
            var el = $("#fb-html-infodetail");
            if (el.hasClass('hide')) {
                el.removeClass('hide');
            } else {
                el.addClass('hide');
            }
        }
        private submitFeedback(): void {
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
        }
        public getfbTemplate(html2canvasSupport: boolean): actionResult<HTMLAnchorElement> {

            if (html2canvasSupport)
                return {
                    isSuccessfull: true,
                    result:
                    this.moduleTag +
                    this.description.responseText +
                    this.highlighter.responseText +
                    this.overview.responseText +
                    this.submitSuccess.responseText +
                    this.submitError.responseText +
                    this.convasTag +
                    this.helperTag +
                    this.noteTag + this.endTag
                }
            return {
                isSuccessfull: false,
                result: this.moduleTag +
                this.browserNotSupport.responseText +
                this.endTag
            }
        }
    }

    export class feedbackOptions {
        private fb_Content: feedbackContent;
        constructor(
            public onStart: () => void = function () { },
            public onClose: () => void = function () { },
            public url: string= "localhost/send",
            private contentTemplate: any = {
                description: "../src/templates/fa-Ir/description.html",
                highlighter: "../src/templates/fa-Ir/highlighter.html",
                overview: "../src/templates/fa-Ir/overview.html",
                submitSuccess: "../src/templates/fa-Ir/submitSuccess.html",
                submitError: "../src/templates/fa-Ir/submitError.html",
                browserNotSupport: "../src/templates/fa-Ir/browserNotSupport.html",
            }) {
            this.fb_Content = new feedbackContent(
                this.url,
                this.contentTemplate.description,
                this.contentTemplate.highlighter,
                this.contentTemplate.overview,
                this.contentTemplate.submitSuccess,
                this.contentTemplate.submitError,
                this.contentTemplate.browserNotSupport,
                this.onClose);
        }
        public getfbTemplate(): actionResult<HTMLAnchorElement> {
            return this.fb_Content.getfbTemplate(this.html2ConvasSupport);
        }
        public initialize(fb_initializer: fbInitializer): void {
            switch (fb_initializer) {
                case fbInitializer.all: {
                    this.fb_Content.initializeContent();
                    this.fb_Content.initializeCanvas();
                    break;
                }
                case fbInitializer.fbContent: {
                    this.fb_Content.initializeContent();
                    break;
                }
                case fbInitializer.fbCanvas: {
                    this.fb_Content.initializeCanvas();
                    break;
                }
                default: {
                    this.fb_Content.initializeContent();
                    break;
                }
            }
        }
        private html2ConvasSupport: boolean = true;// !!window.HTMLCanvasElement; //FIXME
    }
    export class feedback {
        constructor(private $element: string, private feedbackOptions: feedbackOptions) {
            $("#" + $element).on("click", (event: JQueryEventObject) => this.openfb(event));
        }
        public openfb(event: JQueryEventObject): void {
            this.feedbackOptions.onStart.call(this);
            var factoryResult = this.feedbackOptions.getfbTemplate();
            $('body').append(factoryResult.result);
            if (factoryResult.isSuccessfull) {
                this.feedbackOptions.initialize(fbInitializer.all);
            } else {
                this.feedbackOptions.initialize(fbInitializer.fbContent);
            }
            var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
            var $element: JQuery = $(event.target);
        }
    }
}
