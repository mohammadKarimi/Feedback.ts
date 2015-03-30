/// <reference path="html2canvas.js" />
/// <reference path="../jquery-1.10.2.min.js" />
(function ($) {

    $.fn.feedback = function (options) {
        var settings = $.extend({
            url: '',
            verbType: 'post',
            html2canvasUrl: 'html2canvas.js',
            onScreenshotTaken: function () { },
            fbContent: {
                description: '<div id="feedback-description"><div class="feedback-logo">سیستم بازخورد</div><div class="feedback-text" >سیستم بازخورد به شما این اجازه را میدهد که انتقادات و پیشنهادهایتان را با ما در میان بگذارید .</div><div class="feedback-text" >موضوع:</div><select><option>انتقاد</option></select><div class="feedback-text" >توضیحات:</div><textarea id="feedback-note"></textarea><div class="feedback-text" >در مرحله بعدی شما می توانید توضیحات خود را با ابزار ارائه شده مشخص نمایید</div><button id="feedback-description-next" class="feedback-next-btn feedback-btn-blue">مرحله بعد</button><div id="feedback-description-error">لطفا توضیحات را وارد نمایید</div><div class="feedback-close"></div></div>',
                highlighter: '<div id="feedback-highlighter"><div class="feedback-logo">سیستم بازخورد</div><div class="feedback-text m-bottom-20" >لطفا بر روی ابزار های پائین کلیک نمایید و سپس بر روی صفحه بگیرید و بکشید.</div><button class="feedback-sethighlight feedback-active"><div class="ico"></div><span>مشخص سازی</span></button><label>مکان های مورد نظر خود را با این ابزار مشخص نمایید</label><button class="feedback-setblackout"><div class="ico"></div><span>مخفی سازی</span></button><label class="lower">اطلاعات شخصی خود را با این ابزار مخفی نمایید</label><div class="feedback-buttons"><button id="feedback-highlighter-next" class="feedback-next-btn feedback-btn-blue">مرحله بعد</button><button id="feedback-highlighter-back" class="feedback-back-btn feedback-btn-gray">مرحله قبلی</button></div><div class="feedback-close"></div></div>',
                overview: '<div id="feedback-overview"><div class="feedback-logo">سیستم بازخورد</div><div id="feedback-overview-description"><div id="feedback-overview-description-text"><h3>توضیحات</h3><h3 class="feedback-additional">اطلاعات بیشتر</h3><div id="feedback-additional-none"><span>...</span></div><div id="feedback-browser-info"><div class="according">اطلاعات مرورگر</div></div><div id="feedback-page-info"><div class="according">اطلاعات صفحه</div></div><div id="feedback-page-structure"><div class="according">ساختار صفحه</div></div></div></div><div id="feedback-overview-screenshot"><h3>تصویر صفحه</h3></div><div class="feedback-buttons"><button id="feedback-submit" class="feedback-submit-btn feedback-btn-blue">ارسال بازخورد</button><button id="feedback-overview-back" class="feedback-back-btn feedback-btn-gray">مرحله قبلی</button></div><div id="feedback-overview-error">لطفا توضیحات را وارد نمایید</div><div class="feedback-close"></div></div>',
                submitSuccess: '<div id="feedback-submit-success"><div class="feedback-logo">سیستم بازخورد</div><div class="feedback-text" >با تشکر از ارسال بازخورد شما.</div><div class="feedback-text" >ما نمیتوانیم تمام بازخورد های ارسالی را به صورت تک به تک پاسخ دهیم اما بازخورد ها میتواند تجربه کاری ما را برای ارتقا سیستم ها افزایش دهد.</div><button class="feedback-close-btn feedback-btn-blue">بستن</button><div class="feedback-close"></div></div>',
                submitError: '<div id="feedback-submit-error"><div class="feedback-logo">سیستم بازخورد</div><div class="feedback-text" >متاسفانه ارسال بازخورد با خطا مواجه شد لطفا مجددا تلاش نمایید</div><button class="feedback-close-btn feedback-btn-blue">بستن</button><div class="feedback-close"></div></div>'
            },
            onClose: function () { },
        }, options);

        var highlighCount = 1;
        settings.feedbackButton = $(this).selector;
        // تشخیص اینکه آیا مرورگر تگ کانواس را پشتیبانی می کند؟
        var browserSupportConvasElement = !!window.HTMLCanvasElement;
        var html2canvasloaded = false;
        if (browserSupportConvasElement) {
            // ایجاد اونت کلیک بر روی المنت اعلامی از سمت کاربر
            $(document).on('click', settings.feedbackButton, function () {
                if (!html2canvasloaded) {
                    $.getScript(settings.html2canvasUrl, function () {
                        html2canvasloaded = true;
                    });
                }

                var canDraw = false,
					img = '',
					docheight = $(document).height(),
					docwidth = $(document).width(),
					fbContent = '<div id="feedback-module">';

                fbContent += settings.fbContent.description + settings.fbContent.highlighter + settings.fbContent.overview + '<canvas dir="rtl"  id="feedback-canvas"></canvas><div id="feedback-helpers"></div><input id="feedback-note" name="feedback-note" type="hidden"></div>';
                //نمایش صفحه فیدبک در تگ بادی
                $('body').append(fbContent);

                moduleStyle = {
                    'position': 'absolute',
                    'left': '0px',
                    'top': '0px'
                };
                canvasAttr = {
                    'width': docwidth,
                    'height': docheight
                };

                $('#feedback-module').css(moduleStyle);
                $('#feedback-canvas').attr(canvasAttr).css('z-index', '30000');

                

                var ctx = $('#feedback-canvas')[0].getContext('2d');
                ctx.fillStyle = 'rgba(102,102,102,0.5)';
                ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());

                rect = {};
                drag = false;
                highlight = 1,
				postData = {};

                //دریافت اطلاعات مرورگر کاربر
                postData.browser = {};
                postData.browser.appCodeName = navigator.appCodeName;
                postData.browser.appName = navigator.appName;
                postData.browser.appVersion = navigator.appVersion;
                postData.browser.cookieEnabled = navigator.cookieEnabled;
                postData.browser.onLine = navigator.onLine;
                postData.browser.platform = navigator.platform;
                postData.browser.userAgent = navigator.userAgent;
                postData.browser.plugins = [];
                $.each(navigator.plugins, function (i) {
                    postData.browser.plugins.push(navigator.plugins[i].name);
                });


                //نمایش اطلاعات مرورگر در صفحه اورویو
                $('#feedback-browser-info').show();

                //دریافت اطلاعات آدرس
                postData.url = document.URL;
                $('#feedback-page-info').show();

                //دریافت اطلاعات اچ تی ام ال صفحه
                postData.html = $('html').html().replace($('#feedback-module').html(), '');
                $('#feedback-page-structure').show();

                $(document).on('mousedown', '#feedback-canvas', function (e) {

                    if (canDraw) {

                        rect.startX = e.pageX - $(this).offset().left;
                        rect.startY = e.pageY - $(this).offset().top;
                        rect.w = 0;
                        rect.h = 0;
                        drag = true;
                    }
                });

                $(document).on('mouseup', function () {
                    if (canDraw) {
                        drag = false;

                        var dtop = rect.startY,
							dleft = rect.startX,
							dwidth = rect.w,
							dheight = rect.h;
                        dtype = 'highlight';

                        if (dwidth == 0 || dheight == 0) return;

                        if (dwidth < 0) {
                            dleft += dwidth;
                            dwidth *= -1;
                        }
                        if (dheight < 0) {
                            dtop += dheight;
                            dheight *= -1;
                        }

                        if (dtop + dheight > $(document).height())
                            dheight = $(document).height() - dtop;
                        if (dleft + dwidth > $(document).width())
                            dwidth = $(document).width() - dleft;

                        if (highlight == 0)
                            dtype = 'blackout';

                        $('#feedback-helpers').append('<div class="feedback-helper" data-type="' + dtype + '" data-time="' + Date.now() + '" style="position:absolute;top:' + dtop + 'px;left:' + dleft + 'px;width:' + dwidth + 'px;height:' + dheight + 'px;z-index:30000;"><div class="highlightCounter">' + highlighCount + '</div><div class="highlightText" contenteditable="true" style="width:' + (dwidth - 6) + 'px"></div></div>');
                        highlighCount++;
                        redraw(ctx);
                        rect.w = 0;
                    }

                });

                $(document).on('mousemove', function (e) {
                    if (canDraw && drag) {
                        $('#feedback-highlighter').css('cursor', 'default');

                        rect.w = (e.pageX - $('#feedback-canvas').offset().left) - rect.startX;
                        rect.h = (e.pageY - $('#feedback-canvas').offset().top) - rect.startY;

                        ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                        ctx.fillStyle = 'rgba(102,102,102,0.5)';
                        ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'highlight')
                                drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                        });
                        if (highlight == 1) {
                            drawlines(ctx, rect.startX, rect.startY, rect.w, rect.h);
                            ctx.clearRect(rect.startX, rect.startY, rect.w, rect.h);
                        }
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'highlight')
                                ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                        });
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'blackout') {
                                ctx.fillStyle = 'rgba(0,0,0,1)';
                                ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                            }
                        });
                        if (highlight == 0) {
                            ctx.fillStyle = 'rgba(0,0,0,0.5)';
                            ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
                        }
                    }
                });

                $(document).on('mouseleave', 'body,#feedback-canvas', function () {
                    redraw(ctx);
                });

                $(document).on('mouseenter', '.feedback-helper', function () {
                    redraw(ctx);
                });

                $(document).on('click', '#feedback-description-next', function () {
                    if ($('#feedback-note').val().length > 0) {
                        highlightDraggable();
                        canDraw = true;
                        $('#feedback-canvas').css('cursor', 'crosshair');
                        $('#feedback-helpers').show();
                        $('#feedback-description').hide();
                        $('#feedback-highlighter').show();
                    }
                    else {
                        $('#feedback-description-error').show();
                    }
                });

                $(document).on('mouseenter mouseleave', '.feedback-helper', function (e) {
                    if (drag)
                        return;

                    rect.w = 0;
                    rect.h = 0;

                    if (e.type === 'mouseenter') {
                        $(this).css('z-index', '30001');
                        // $(this).append('<div class="feedback-helper-inner" style="width:' + ($(this).width() - 2) + 'px;height:' + ($(this).height() - 2) + 'px;position:absolute;margin:1px;"></div>');
                        $(this).append('<div id="feedback-close"></div>');
                        $(this).find('#feedback-close').css({
                            'top': -1 * ($(this).find('#feedback-close').height() / 2) + 'px',
                            'left': $(this).width() - ($(this).find('#feedback-close').width() / 2) + 'px'
                        });

                        if ($(this).attr('data-type') == 'blackout') {
                            /* redraw white */
                            ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                            ctx.fillStyle = 'rgba(102,102,102,0.5)';
                            ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-type') == 'highlight')
                                    drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                            });
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-type') == 'highlight')
                                    ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                            });

                            ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                            ctx.fillStyle = 'rgba(0,0,0,0.75)';
                            ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());

                            ignore = $(this).attr('data-time');

                            /* redraw black */
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-time') == ignore)
                                    return true;
                                if ($(this).attr('data-type') == 'blackout') {
                                    ctx.fillStyle = 'rgba(0,0,0,1)';
                                    ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                                }
                            });
                        }
                    }
                    else {
                        $(this).css('z-index', '30000');
                        $(this).find('#feedback-close').remove();
                        if ($(this).attr('data-type') == 'blackout') {
                            redraw(ctx);
                        }
                    }
                });

                $(document).on('click', '#feedback-close', function () {
                    highlighCount--;
                    var numberSelect = parseInt($(this).parent().find(".highlightCounter").html());
                    if (settings.highlightElement && $(this).parent().attr('data-highlight-id'))
                        var _hidx = $(this).parent().attr('data-highlight-id');

                    $(this).parent().remove();

                    if (settings.highlightElement && _hidx)
                        $('[data-highlight-id="' + _hidx + '"]').removeAttr('data-highlighted').removeAttr('data-highlight-id');
                    redraw(ctx);
                    $.each($(".highlightCounter"), function (index, item) {

                        var number = parseInt($(this).html());
                        if (number >= numberSelect) {
                            $(this).html(number - 1);

                        }
                    });
                });

                //بستن ویزارد بازخورد
                $('#feedback-module').on('click', '.feedback-close,.feedback-close-btn', function () {
                    console.log('call close()');
                    close();
                });
                $(document).on('keyup', function (e) {
                    if (e.keyCode == 27) {
                        close();
                    }
                });

                $(document).on('click', '#feedback-highlighter-back', function () {
                    canDraw = false;
                    $('#feedback-canvas').css('cursor', 'default');
                    
                    $('#feedback-highlighter').hide();
                    $('#feedback-description-error').hide();
                    $('#feedback-description').show();
                });

                $(document).on('mousedown', '.feedback-sethighlight', function () {
                    highlight = 1;
                    $(this).addClass('feedback-active');
                    $('.feedback-setblackout').removeClass('feedback-active');
                });
                $(document).on('mousedown', '.feedback-setblackout', function () {
                    highlight = 0;
                    $(this).addClass('feedback-active');
                    $('.feedback-sethighlight').removeClass('feedback-active');
                });


                $(document).on('click', '#feedback-highlighter-next', function () {
                    canDraw = false;
                    $('#feedback-canvas').css('cursor', 'default');
                    var sy = $(document).scrollTop(),
						dh = $(window).height();
                    $('#feedback-highlighter').hide();
                    if (!settings.screenshotStroke) {
                        redraw(ctx, false);
                    }
                    html2canvas($('body'), {
                        onrendered: function (canvas) {
                            if (!settings.screenshotStroke) {
                                redraw(ctx);
                            }
                            _canvas = $('<canvas id="feedback-canvas-tmp" dir="rtl" width="' + docwidth + '" height="' + dh + '"/>').hide().appendTo('body');
                            _ctx = _canvas.get(0).getContext('2d');
                            _ctx.fillStyle = "#000";
                            _ctx.font = "bold 16px Arial";

                            _ctx.drawImage(canvas, 0, sy, docwidth, dh, 0, 0, docwidth, dh);
                            img = _canvas.get(0).toDataURL();
                            $(document).scrollTop(sy);
                            postData.img = img;
                            settings.onScreenshotTaken(postData.img);
                            $('#feedback-canvas-tmp').remove();
                            $('#feedback-overview').show();
                            $('#feedback-overview-description-text>textarea').remove();
                            $('#feedback-overview-screenshot>img').remove();
                            $('<textarea id="feedback-overview-note">' + $('#feedback-note').val() + '</textarea>').insertAfter('#feedback-overview-description-text h3:eq(0)');
                            $('#feedback-overview-screenshot').append('<img class="feedback-screenshot" src="' + img + '" />');

                            $("#feedback-browser-info").append(
                                '<div class="hide" id="feedback-browser-infodetail"><div class="text-right">نام کد برنامه : ' + postData.browser.appCodeName + '</div>' +
                                '<div class="text-right">نام برنامه : ' + postData.browser.appName + '</div>' +
                                '<div class="text-right">ورژن مرورگر : ' + postData.browser.appVersion + '</div>' +
                                '<div class="text-right">کوکی : ' + postData.browser.cookieEnabled + '</div>' +
                                '<div class="text-right">وضعیت شبکه : ' + postData.browser.onLine + '</div>' +
                                '<div class="text-right">پلتفرم : ' + postData.browser.platform + '</div>' +
                                '<div class="text-right">سیستم عامل کاربر : ' + postData.browser.userAgent + '</div>'
                                + '</div>');

                            $("#feedback-page-info").append(
                               '<div class="hide" id="feedback-page-infodetail">' +
                               '<div class="text-right">آدرس جاری : ' + postData.url + '</div>' +
                                '</div>');
                            $("#feedback-page-structure").append(
                               '<div class="hide" id="feedback-structure-infodetail">' +
                               '<div class="text-left" id="html"></div>' +
                               '</div>');
                            $("#html").text(postData.html);
                        },
                        proxy: settings.proxy,
                        letterRendering: settings.letterRendering
                    });
                });

                $(document).on('click', "#feedback-browser-info", function () {
                    if ($("#feedback-browser-infodetail").hasClass('hide')) {
                        $("#feedback-browser-infodetail").removeClass('hide');
                    } else {
                        $("#feedback-browser-infodetail").addClass('hide');
                    }
                });
                $(document).on('click', "#feedback-page-info", function () {
                    if ($("#feedback-page-infodetail").hasClass('hide')) {
                        $("#feedback-page-infodetail").removeClass('hide');
                    } else {
                        $("#feedback-page-infodetail").addClass('hide');
                    }
                });
                $(document).on('click', "#feedback-page-structure", function () {
                    if ($("#feedback-structure-infodetail").hasClass('hide')) {
                        $("#feedback-structure-infodetail").removeClass('hide');
                    } else {
                        $("#feedback-structure-infodetail").addClass('hide');
                    }
                });
                $(document).on('click', '#feedback-overview-back', function (e) {
                    canDraw = true;
                    $('#feedback-canvas').css('cursor', 'crosshair');
                    $('#feedback-overview').hide();
                    $('#feedback-helpers').show();
                    $('#feedback-highlighter').show();
                    $('#feedback-overview-error').hide();
                });
                $(document).on('keyup', '#feedback-note,#feedback-overview-note', function (e) {
                    var tx;
                    if (e.target.id === 'feedback-note')
                        tx = $('#feedback-note').val();
                    else {
                        tx = $('#feedback-overview-note').val();
                        $('#feedback-note').val(tx);
                    }

                    $('#feedback-note').val(tx);
                });
                $(document).on('click', '#feedback-submit', function () {
                    canDraw = false;

                    if ($('#feedback-note').val().length > 0) {
                        $('#feedback-submit-success,#feedback-submit-error').remove();
                        $('#feedback-overview').hide();

                        postData.img = img;
                        postData.note = $('#feedback-note').val();
                        var data = { feedback: JSON.stringify(postData) };
                        $.ajax({
                            url: settings.ajaxURL,
                            dataType: 'json',
                            type: 'POST',
                            data: data,
                            success: function () {
                                $('#feedback-module').append(settings.fbContent.submitSuccess);
                            },
                            error: function () {
                                $('#feedback-module').append(settings.fbContent.submitError);
                            }
                        });
                    }
                    else {
                        $('#feedback-overview-error').show();
                    }
                });
            });
        }
        function highlightDraggable() {
            $('#feedback-highlighter').on('mousedown', function (e) {
                var $d = $(this).addClass('feedback-draggable'),
                    drag_h = $d.outerHeight(),
                    drag_w = $d.outerWidth(),
                    pos_y = $d.offset().top + drag_h - e.pageY,
                    pos_x = $d.offset().left + drag_w - e.pageX;
                $d.css('z-index', 40000).parents().on('mousemove', function (e) {
                    _top = e.pageY + pos_y - drag_h;
                    _left = e.pageX + pos_x - drag_w;
                    _bottom = drag_h - e.pageY;
                    _right = drag_w - e.pageX;
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
                    $('.feedback-draggable').offset({
                        top: _top,
                        left: _left
                    }).on("mouseup", function () {
                        $(this).removeClass('feedback-draggable');
                    });
                });
                e.preventDefault();
            }).on('mouseup', function () {
                $(this).removeClass('feedback-draggable');
                $(this).parents().off('mousemove mousedown');
            });
        }
        function close() {
            console.log('close()');
            canDraw = false;
            $(document).off('mouseenter mouseleave', '.feedback-helper');
            $(document).off('mouseup keyup');
            $(document).off('mousedown', '.feedback-setblackout');
            $(document).off('mousedown', '.feedback-sethighlight');
            $(document).off('mousedown click', '#feedback-close');
            $(document).off('mousedown', '#feedback-canvas');
            $(document).off('click', '#feedback-highlighter-next');
            $(document).off('click', '#feedback-highlighter-back');
            $(document).off('click', '#feedback-description-next');
            $(document).off('click', '#feedback-overview-back');
            $(document).off('mouseleave', 'body');
            $(document).off('mouseenter', '.feedback-helper');
            $(document).off('selectstart dragstart', document);
            $('#feedback-module').off('click', '.feedback-close,.feedback-close-btn');
            $(document).off('click', '#feedback-submit');
            $('[data-highlighted="true"]').removeAttr('data-highlight-id').removeAttr('data-highlighted');
            $('#feedback-module').remove();
            $('.feedback-btn').show();
            $(document).off('click', "#feedback-browser-info");
            $(document).off('click', "#feedback-page-info");
            $(document).off('click', "#feedback-page-structure");

            settings.onClose.call(this);
        }
        function redraw(ctx, border) {
            border = typeof border !== 'undefined' ? border : true;
            ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
            ctx.fillStyle = 'rgba(102,102,102,0.5)';
            ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight')
                    if (border)
                        drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
            });
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight')
                    ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
            });
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'blackout') {
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                }
            });
        }
        function drawlines(ctx, x, y, w, h) {
            ctx.strokeStyle = settings.strokeStyle;
            ctx.shadowColor = settings.shadowColor;
            ctx.shadowOffsetX = settings.shadowOffsetX;
            ctx.shadowOffsetY = settings.shadowOffsetY;
            ctx.shadowBlur = settings.shadowBlur;
            ctx.lineJoin = settings.lineJoin;
            ctx.lineWidth = settings.lineWidth;

            ctx.strokeRect(x, y, w, h);

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;
        }
    };

})(jQuery);