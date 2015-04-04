# Feedback.ts
feedback module with Typescript

This script allows you to create feedback forms which include a screenshot And clients browser Information .
Feedback tool similar to the Google Feedback based on Typescript/JQuery and HTML2Canvas.

## Browser Support
Internet Explorer +9
All versions Of Google Chrome
FireFox +3.5
Newer versions of Safari & Opera

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

## Change log
***31.03.2015***
+ add order number of highlighter box
+ add highlightTextbox under the lighter box for type additional description for each highlighter box



