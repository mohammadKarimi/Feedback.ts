/// <reference path="browserinfo/browserinfo.ts" />
/// <reference path="../jquery.d.ts" />
///185
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
    class feedbackConvas {
        constructor(private documentWidth: number, private documentHeight: number) {
            this.$fb_convasSelector = $("#fb-canvas");
            this.fbContext = this.$fb_convasSelector[0].getContext('2d');
            this.fbContext.fillStyle = 'rgba(102,102,102,0.5)';
            this.fbContext.fillRect(0, 0, this.documentWidth, this.documentHeight);

            this.$fb_convasSelector.on("mousedown",(event: JQueryEventObject) => this.startDrawRectangle(event));
            this.$fb_convasSelector.on("mousemove",(event: JQueryEventObject) => this.drawRectangle(event));
            this.$fb_convasSelector.on("mouseup",(event: JQueryEventObject) => this.finishDrawRectangle(event));
            this.$fb_convasSelector.on("mouseleave",(event: JQueryEventObject) => this.redraw(this.fbContext));
            $('.fb-helper').on("mouseleave",(event: JQueryEventObject) => this.redraw(this.fbContext));
        }
        public fbContext: any;
        public isdraged: boolean = false;

        private $fb_convasSelector: any;
        private drawHighlight: boolean = true;
        private canDraw: boolean = false;
        private rectangle: any;
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
                this.rectangle.weidth = 0;
            }
        }
        private redraw(context: any): void {

        }
        private drawlines(context: any, startX: number, startY: number, rectangledrawdWidth: number, rectangledrawdHeight: number): void {

        }
    }
    class feedbackContent {
        constructor(public description: any, public highlighter: any, public overview: any, public submitSuccess: any, public submitFailor: any) { }
        private convasTag: any = '<canvas dir="rtl" id="fb-canvas" style="z-index=999999" width="' + this.documentWidth + '" height="' + this.documentHeight + '"></canvas>';
        private moduleTag: any = '<div id="fb-module" position="absolute" left="0px" top="0px">';
        private helperTag: any = '<div id="fb-helpers"></div>';
        private noteTag: any = '<input id="fb-note" name="fb-note" type="hidden"></div>';
        public documentHeight: number = window.innerHeight;
        public documentWidth: number = window.innerWidth;
        public getFeedbackTemplate(): any {
            return this.moduleTag + this.description
                + this.highlighter + this.overview + this.convasTag
                + this.helperTag + this.noteTag;
        }
    }
    export class feedbackOptions extends feedbackContent {
        constructor(public url: string,
            public onStart: any, public onClose: any,
            contentTemplate: feedbackContent = new feedbackContent("", "", "", "", "")) {
            super(contentTemplate.description, contentTemplate.highlighter, contentTemplate.overview, contentTemplate.submitSuccess, contentTemplate.submitFailor);
        }

        html2ConvasSupport: boolean = true; //!!window.HTMLCanvasElement; FIXME
    }
    export class feedback {
        private _postData: browserInfo = browserInfo.getInformation();
        constructor(private $element: string, private fbOptions: feedbackOptions) {
            $("#" + $element).on("click",(event: JQueryEventObject) => this.openFeedback(event));
        }
        public openFeedback(event: JQueryEventObject): void {
            $('body').appendTo(this.fbOptions.getFeedbackTemplate());
            var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
            var $element: JQuery = $(event.target);
        }
    }
}


