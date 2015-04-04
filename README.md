# Feedback.ts
feedback module with Typescript

This script allows you to create feedback forms which include a screenshot And clients browser Information .
Feedback tool similar to the Google Feedback based on Typescript/JQuery and HTML2Canvas.

## Browser Support
+ Internet Explorer +9
+ All versions Of Google Chrome
+ FireFox +3.5
+ Newer versions of Safari & Opera

## screenshot Support
both rtl and ltr direction.

## Requirements
 jQuery +1.10
 html2canvas

#Setup
To use it you need of course JQuery, so make sure it is loaded first. I always like to use JQuery.com CDN for that:
```html
   <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
```

for create screensnapshot you need html2convas.js , so add it into html file :
```html
   <script src="../src/html2canvas.js"></script>
```
for feedback tool you need add feedback.js ( compiled feedback.ts - typescript) :
```html
  <script src="../src/feedback.js"></script>
  ```
  
  Also you should load the stylesheet of the feedback:
  ```html
<link href="../src/styles/feedback.rtl.css" rel="stylesheet" />
  ```
## Example
Html :
```html
<button id="content">feedback</button>
```
JavaScript:
```javascript
  function onStart() {
            console.log('onStart');
        }
        function onClose() {
            console.log('onClose');
        }

        var options = new phoenix.feedbackOptions(onStart, onClose);
        new phoenix.feedback("content", options);
```
## Options
+ onStart : function (Optional) -> this method call befor feedback module is opened.
+ onClose : function (Optional) -> this method call after feedback module is closed.
+ url : string (Optional) -> this property for send feedback data to custom ajax url.
+ contentTemplate : any (Optional) -> this object contains all html templates in server
# contentTemplate default : 
   + description: "../src/templates/fa-Ir/description.html"
   + highlighter: "../src/templates/fa-Ir/description.html"
   + overview:    "../src/templates/fa-Ir/description.html"
   + submitSuccess: "../src/templates/fa-Ir/description.html"
   + submitError: "../src/templates/fa-Ir/description.html"
   + browserNotSupport: "../src/templates/fa-Ir/description.html"
   
   *in new version all of them merged into one file*
   
## Change log
***31.03.2015***
+ add order number of highlighter box
+ add highlightTextbox under the lighter box for type additional description for each highlighter box



