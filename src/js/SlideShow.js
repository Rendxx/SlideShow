/************************************************ 
Silde Show
Copyright (c) 2014-2015 Dongxu Ren  http://www.rendxx.com/

License: MIT (http://www.opensource.org/licenses/mit-license.php)
Version: 0.2.2
Update: 2016-07-24

Description:
    Enable user to show the HTML as a brief photo album.
    The album enable Next/Previous/Skip function if user provide the HTML elements.
    
    This library will not change the HTML structure, you need to provide all the elements - it will only bind the function on the elements.
    The elements you need to provide:
        1. List of HTML-frame element. An HTML-frame is a Dom element which you want it to be treated as a photo in album.
        2. Next / Prev button. The dom element is what you only need to provide, same as below.
        3. List of Skip button. First element will be linked with the first HTML-frame, and so on.
        4. Container. The element containes all your HTML-frames. 

    And be care of the "position" css of your HTML-frames. Its value will be changed to "absolute".
    PS: you need to use this library after HTML structure is ready.
    
Compatibility:
    Chrome; Fire Fox; Safari; Edge; IE 9-11; IE 7,8;
 
Dependency:
    jQuery

API:
    $$.slideShow(opts)
        - opts: 
            container:          container dom-elements of the frame (required)
            frame:              HTML-frame dom-elements in an array  (required)
            controller:         controller dom-elements in an array
            next:               dom element of next-botton
            prev:               dom element of previous-botton
            activeClass:        css class name of active
            autoSwap:           millisecond of swapping frames, 0 mean no auto swapping

************************************************/

$(function () {
    "use strict";
    var SlideShow = function (opts_in) {
        var that = this;
        var pictureItems = [];                  // array of picture-item object
        var html = {
            container: null,
            controller: [],
            next: null,
            prev: null
        };
        var activeClass = "";           // css class of actived   
        var currentIdx = -1;            // current index
        var autoSwap = 0;               // auto swap time, 0 mean no
        var timeoutFunc = null;         // timeout function

        // goto next picture
        this.next = function () {
            if (pictureItems.length == 0) return;
            var idx = (currentIdx + 1) % pictureItems.length;
            this.goto(idx);
        };

        // goto previous picture
        this.prev = function () {
            if (pictureItems.length == 0) return;
            var idx = (currentIdx - 1 + pictureItems.length) % pictureItems.length;
            this.goto(idx);
        };

        // goto a special picture
        this.goto = function (idx) {
            if (timeoutFunc != null) {
                clearTimeout(timeoutFunc);
                timeoutFunc = null;
            }
            if (currentIdx == idx) {
                if (autoSwap != 0) { timeoutFunc = setTimeout(function () { that.next(); }, autoSwap); }
                return;
            }

            if (pictureItems.length == 0 || idx < 0 || idx >= pictureItems.length) return;
            html.controller[idx].addClass(activeClass);
            pictureItems[idx].show();
            if (currentIdx >= 0 && currentIdx < pictureItems.length) {
                html.controller[currentIdx].removeClass(activeClass);
                pictureItems[currentIdx].hide();
            }
            currentIdx = idx;

            if (autoSwap != 0) { timeoutFunc = setTimeout(function () { that.next(); }, autoSwap); }
        };

        // setup function
        var _itemSetup = function (pictureEles) {
            pictureItems = [];
            for (var i = 0; i < pictureEles.length; i++) {
                var newItem = new pictureItem({ ele: $(pictureEles[i]) });
                pictureItems.push(newItem);
            }
        };

        var _controllerSetup = function (controller, nextEle, preEle) {
            if (controller != null) 
                for (var i = 0; i < controller.length; i++) {
                    html.controller[i] = $(controller[i]);
                    html.controller[i].click({ idx: i }, function (e) {
                        that.goto(e.data.idx);
                    });
                }            
            if (nextEle != null) {
                html.next = $(nextEle);
                html.next.click(function () {
                    that.next();
                });
            } if (preEle != null) {
                html.prev = $(preEle);
                html.prev.click(function () {
                    that.prev();
                });
            }
        };

        var _containerSetup = function (container) {
            // add "position = relative" to the container element
            html.container = $(container);
            if (html.container.css("position") == null || (html.container.css("position").toLowerCase() != "absolute" && html.container.css("position").toLowerCase() != "fixed"))
                html.container.css("position","relative");
        };

        var _init = function (opts) {
            _containerSetup(opts.container);
            _itemSetup(opts.frame);
            _controllerSetup(opts.controller, opts.next, opts.prev);
            if (opts.activeClass != null) activeClass = opts.activeClass;
            if (opts.autoSwap != null) autoSwap = opts.autoSwap;

            that.goto(0);
        }(opts_in);
    };

    // picture function class
    var pictureItem = function (opts_in) {
        var that = this;
        this.ele = null;            // picture element
        this.actived = false;       // whether this picture is actived

        this.show = function (functionName) {
            functionName = functionName || "defaultFunc";
            showFunction[functionName](that.ele);
            this.actived = true;
        };

        this.hide = function (functionName) {
            functionName = functionName || "defaultFunc";
            hideFunction[functionName](that.ele);
            this.actived = false;
        };

        var _funcSetup = function () {
        };

        // scan the whole dom-tree to find image to preload them
        // <image> & background-image on all elements will be found
        var _preload = function () {
            var buiudImg = function (src) {
                if (src == null || src.legnth === 0) return;
                if (src[0] == src[src.length - 1] && (src[0] === '\'' || src[0] === '\"')) {
                    src = src.substring(1, src.length - 1);
                }
                if (src == "") return;
                var img = new Image();
                img.onload = function () {
                    img = null;
                };
                img.src = src;
            };

            try {
                // scan all <image>
                var images = that.ele.find("image");
                for (var i = 0; i < images.length; i++) {
                    buiudImg(images[i].src);
                }

                // scan all the background-images
                var dfs = function (ele) {
                    var $ele = $(ele);
                    var bg = $ele.css("background-image")
                    if (bg != "" && bg != "none") {
                        buiudImg(bg.split('(')[1].split(')')[0]);
                    }
                    var ch = $ele.children();
                    for (var i = 0; i < ch.length; i++) dfs(ch[i]);
                };
                dfs(that.ele[0]);
            } catch (e) {
            }
        };

        var _init = function (opts) {
            that.ele = opts.ele;
            that.ele.css({
                position: "absolute",
                top:"0px",
                left:"0px"
            });
            that.ele.hide();
            _funcSetup();
            _preload();
        }(opts_in);
    };
    
    // Show / Hide animation function
    var showFunction = {
        "defaultFunc": function (ele) {
            ele.css("z-index", 1);
            ele.stop(true, true).fadeIn(1, function () {
                ele.css("z-index", 2);
            });
        }
    };

    var hideFunction = {
        "defaultFunc": function (ele) {
            ele.css("z-index", 3);
            ele.stop(true, true).fadeOut(1000);
        }
    };
    
    // register function to window
    var _register = function () {
        window.$$ = window.$$ || {};
        window.$$.slideShow = function (opts_in) { new SlideShow(opts_in); };
    }();
});