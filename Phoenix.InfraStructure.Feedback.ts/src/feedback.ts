/// <reference path="../jquery.d.ts" />
///187
module phoenix {
    interface rectangleObject {
        startX: number;
        startY: number;
        width: number;
        height: number
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
        static getInformation(): browserInfo {
            for (var plugin in navigator.plugins) {
                //this.prototype.plugins.push(navigator.plugins[plugin].name);
            }
            return new this;
        }
    }
    class feedbackCanvas {
        constructor(public documentWidth: number, public documentHeight: number) {
        }
        public initialize() {
            this.$fb_convasSelector = $("#fb-canvas");
            this.fbContext = this.$fb_convasSelector[0].getContext('2d');
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);
            this.$fb_convasSelector.on("mousedown", (event: JQueryEventObject) => this.startDrawRectangle(event));
            this.$fb_convasSelector.on("mousemove", (event: JQueryEventObject) => this.drawRectangle(event));
            this.$fb_convasSelector.on("mouseup", (event: JQueryEventObject) => this.finishDrawRectangle(event));
            this.$fb_convasSelector.on("mouseleave", (event: JQueryEventObject) => this.redraw(this.fbContext));
            $('.fb-helper').on("mouseleave", (event: JQueryEventObject) => this.redraw(this.fbContext));
        }
        public fbContext: any;
        public isdraged: boolean = false;

        private $fb_convasSelector: any;
        public drawHighlight: boolean = true;
        public canDraw: boolean = false;
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
                this.redraw(this.fbContext);
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
                if (this.drawHighlight == false)
                    rectangleDrawedType = 'blackout';

                $('#fb-helpers').append('<div class="fb-helper" data-type="' + rectangleDrawedType + '" data-time="' + Date.now() + '" style="position:absolute;top:' + rectangleDrawedTop + 'px;left:' + rectangleDrawedLeft + 'px;width:' + rectangleDrawedWidth + 'px;height:' + rectangleDrawedHeight + 'px;z-index:30000;"><div class="highlightCounter">' + this.highlightCounter + '</div><div class="highlightText" contenteditable="true" style="width:' + (rectangleDrawedWidth - 6) + 'px"></div></div>');
                this.highlightCounter++;
                this.redraw(this.fbContext);
            }
        }
        private redraw(fbContext: any): void {
            $('.fb-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight') {
                    var startX = parseInt($(this).css('left'), 10);
                    var startY = parseInt($(this).css('top'), 10);
                    var width = $(this).width();
                    var height = $(this).height();
                    fbContext.clearRect(startX, startY, width, height);
                }
            });
            $('.fb-helper').each(function () {
                if ($(this).attr('data-type') == 'blackout') {
                    fbContext.fillStyle = 'rgba(0,0,0,1)';
                    fbContext.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                   }
            });
        }
    }
    class feedbackContent extends feedbackCanvas {
        private convasTag: any = '<canvas dir="rtl" id="fb-canvas" style="z-index=999999" width="' + window.innerWidth + '" height="' + window.innerHeight + '"></canvas>';
        private moduleTag: any = '<div id="fb-module" position="absolute" left="0px" top="0px">';
        private helperTag: any = '<div id="fb-helpers"></div>';
        private noteTag: any = '<input id="fb-note" name="fb-note" type="hidden"></div>';

        public documentHeight: number = window.innerHeight;
        public documentWidth: number = window.innerWidth;

        constructor(public description: any,
            public highlighter: any,
            public overview: any,
            public submitSuccess: any,
            public submitFailor: any,
            public onClose: () => void) {
            super(window.innerWidth, window.innerHeight);
            $(document).on("click", "#fb-description-next", (event: JQueryEventObject) => this.nextToHighlighter());
            $(document).on("click", "#fb-highlighter-back", (event: JQueryEventObject) => this.backToDescription());
            $(document).on("click", "#fb-highlighter-next", (event: JQueryEventObject) => this.nextToOverview());
            $(document).on('click', '.fb-sethighlight', (el: JQuery) => this.setHighlight(el));
            $(document).on('click', '.fb-setblackout', (el: JQuery) => this.setBlackout(el));
        }
        private closeFeedbackModule() {
            this.canDraw = false;
            //$(document).off('mouseenter mouseleave', '.fb-helper');
            //$(document).off('mouseup keyup');
            //$(document).off('mousedown', '.fb-setblackout');
            //$(document).off('mousedown', '.fb-sethighlight');
            //$(document).off('mousedown click', '#fb-rectangle-close');
            //$(document).off('mousedown', '#fb-canvas');
            //$(document).off('click', '#fb-highlighter-next');
            //$(document).off('click', '#fb-highlighter-back');
            //$(document).off('click', '#fb-description-next');
            //$(document).off('click', '#fb-overview-back');
            //$(document).off('mouseleave', 'body');
            //$(document).off('mouseenter', '.fb-helper');
            //$(document).off('selectstart dragstart', document);
            //$('#fb-module').off('click', '.fb-rectangle-close,.fb-rectangle-close-btn');
            //$(document).off('click', '#fb-submit');
            //$('[data-highlighted="true"]').removeAttr('data-highlight-id').removeAttr('data-highlighted');
            //$('#fb-module').remove();
            //$('.fb-btn').show();
            //$(document).off('click', "#fb-browser-info");
            //$(document).off('click', "#fb-page-info");
            //$(document).off('click', "#fb-page-structure");
            this.onClose.call(this);
        }
        public getFeedbackTemplate(): any {
            return this.moduleTag +
                this.description.responseText +
                this.highlighter.responseText +
                this.overview.responseText +
                this.submitSuccess.responseText +
                this.submitFailor.responseText +
                this.convasTag +
                this.helperTag +
                this.noteTag;
        }
        private nextToHighlighter(): void {
            if ($('#fb-note').val().length > 0) {
                //highlightDraggable();
                this.canDraw = true;
                $('#fb-canvas').css('cursor', 'crosshair');
                $('#fb-helpers').show();
                $('#fb-description').hide();
                $('#fb-highlighter').show();
            }
            else {
                $('#fb-description-error').show();
            }
        }
        private backToDescription(): void {
            this.canDraw = false;
            $('#fb-canvas').css('cursor', 'default');
            $('#fb-highlighter').hide();
            $('#fb-description-error').hide();
            $('#fb-description').show();
        }
        private nextToOverview(): void {

        }
        private backToHighlighter() {
            this.canDraw = true;
            $('#fb-canvas').css('cursor', 'crosshair');
            $('#fb-overview').hide();
            $('#fb-helpers').show();
            $('#fb-highlighter').show();
            $('#fb-overview-error').hide();
        }

        private setHighlight(el): void {
            this.drawHighlight = true;
            $('.fb-sethighlight').addClass('fb-active');
            $('.fb-setblackout').removeClass('fb-active');
        }

        private setBlackout(el): void {
            this.drawHighlight = false;
            $('.fb-setblackout').addClass('fb-active');
            $('.fb-sethighlight').removeClass('fb-active');
        }
    }
    export class feedbackOptions {
        private fb_Content: feedbackContent;
        constructor(public url: string,
            public onStart: () => void,
            public onClose: () => void,
            private contentTemplate: any = {
                description: $.get("../src/templates/description.html", function (html) { return html; }),
                highlighter: $.get("../src/templates/highlighter.html", function (html) { return html; }),
                overview: $.get("../src/templates/overview.html", function (html) { return html; }),
                submitSuccess: $.get("../src/templates/submitSuccess.html", function (html) { return html; }),
                submitFailor: $.get("../src/templates/submitFailor.html", function (html) { return html; })
            }) {
            this.fb_Content = new feedbackContent(this.contentTemplate.description,
                this.contentTemplate.highlighter,
                this.contentTemplate.overview,
                this.contentTemplate.submitSuccess,
                this.contentTemplate.submitFailor,
                this.contentTemplate.onClose);
        }
        public getFeedbackTemplate(): any {
            return this.fb_Content.getFeedbackTemplate();
        }
        public initializeConvas(): void {
            this.fb_Content.initialize();
        }
        private html2ConvasSupport: boolean = true; //!!window.HTMLCanvasElement; FIXME
    }
    export class feedback {
        private _postData: browserInfo = browserInfo.getInformation();
        constructor(private $element: string, private fbOptions: feedbackOptions) {
            $("#" + $element).on("click", (event: JQueryEventObject) => this.openFeedback(event));
        }
        public openFeedback(event: JQueryEventObject): void {
            this.fbOptions.onStart.call(this);
            $('body').append(this.fbOptions.getFeedbackTemplate());
            this.fbOptions.initializeConvas();
            var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
            var $element: JQuery = $(event.target);
        }
    }
}


