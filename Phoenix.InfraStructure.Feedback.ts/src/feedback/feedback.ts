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
        constructor(url: string, onStart: any, onClose: any, feedbackContent: feedbackContent) {
            super();
            this.url = url;
            this.onClose = onClose;
            this.onStart = onStart;
            this.description = feedbackContent.description;
            this.highlighter = feedbackContent.highlighter;
            this.overview = feedbackContent.overview;
            this.submitSuccess = feedbackContent.submitSuccess;
            this.submitFailor = feedbackContent.submitFailor;
        }
        url: string;
        onClose: any;
        onStart: any;
        highlightCounter: number = 1;
        documentHeight: number = window.innerHeight;
        documentWidth: number = window.innerWidth;
        html2ConvasSupport: boolean = !!window.HTMLCanvasElement;
    }
   export class feedback {
      private   _fbOptions: feedbackOptions;
        private _$element: string;
        private _postData: browserInfo = browserInfo.getInformation();
       constructor($element: string, fbOptions: feedbackOptions) {
           $("#" + $element).on("click", (event: JQueryEventObject) => this.openFeedback(event));
            this._$element = $element;
            this._fbOptions = fbOptions
        }
       public openFeedback(event: JQueryEventObject): void {
           var htmlAnchorElement: HTMLAnchorElement = <HTMLAnchorElement> event.target;
           var $element: JQuery = $(event.target);
       }
    }
}


