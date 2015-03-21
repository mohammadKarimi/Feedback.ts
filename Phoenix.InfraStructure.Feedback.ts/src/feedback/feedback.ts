/// <reference path="browserinfo/browserinfo.ts" />
/// <reference path="../jquery.d.ts" />

module phoenix {
    export class feedbackContent {
        description: any = "";
        highlighter: any = "";
        overview: any = "";
        submitSuccess: any = "";
        submitFailor: any = "";
    }
    export class feedbackOptions extends feedbackContent {
        constructor(public url: string,
            public onStart: any, public onClose: any,
            feedbackContent: feedbackContent) {
            super();
            this.description = feedbackContent.description;
            this.highlighter = feedbackContent.highlighter;
            this.overview = feedbackContent.overview;
            this.submitSuccess = feedbackContent.submitSuccess;
            this.submitFailor = feedbackContent.submitFailor;
        }
        highlightCounter: number = 1;
        documentHeight: number = window.innerHeight;
        documentWidth: number = window.innerWidth;
        html2ConvasSupport: boolean = !!window.HTMLCanvasElement;
    }
    export class feedback {
        private _postData: browserInfo = browserInfo.getInformation();
        constructor(private $element: string,private fbOptions: feedbackOptions) {
            $("#" + $element).on("click",(event: JQueryEventObject) => this.openFeedback(event));
        }
        public openFeedback(event: JQueryEventObject): void {
            var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
            var $element: JQuery = $(event.target);
        }
    }
}


