/// <reference path="browserinfo/browserinfo.ts" />
/// <reference path="../jquery.d.ts" />

module phoenix {
    class feedbackContent {
        constructor(public description: any, public highlighter: any, public overview: any, public submitSuccess: any, public submitFailor: any) { }
        private moduleTag: any = '<div id="fb-module" position="absolute" left="0px" top="0px">';
        private convasTag: any = '<canvas dir= "rtl" id="fb-canvas" style="z-index=999999" width="' + this.documentWidth + '" height="' + this.documentHeight + '"></canvas>';
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
        highlightCounter: number = 1;
        html2ConvasSupport: boolean = true; //!!window.HTMLCanvasElement; FIXME
    }
    export class feedback {
        private _postData: browserInfo = browserInfo.getInformation();
        constructor(private $element: string, private fbOptions: feedbackOptions) {
            $("#" + $element).on("click",(event: JQueryEventObject) => this.openFeedback(event));
        }
        public openFeedback(event: JQueryEventObject): void {
            var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
            var $element: JQuery = $(event.target);
        }
    }
}


