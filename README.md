# Slide Show
Enable user to show the HTML blocks as slides. Next/Previous/Skip is available for the slide.
    
This library will not change the HTML structure, you need to provide all the elements - it will only bind the function on the elements.  

The elements you need to provide:
+ **List of HTML-frame element**. An HTML-frame is a Dom element which you want it to be treated as a photo in album.
+ **Next / Prev button**. The dom element is what you only need to provide, same as below.
+ **List of Skip button**. First element will be linked with the first HTML-frame, and so on.
+ **Container**. The element containes all your HTML-frames. 

And be care of the "position" css of your HTML-frames. Its value will be changed to "absolute".  
PS: you need to use this library after HTML structure is ready.
   
![preview](https://raw.githubusercontent.com/Rendxx/SlideShow/master/preview.png "Preview")

*Sample: [http://www.rendxx.com/Lib/Sample/8](http://www.rendxx.com/Lib/Sample/8 "Sample")*  
*Download: [Slide Show v0.2.1](https://github.com/Rendxx/SlideShow/releases/tag/0.2.1 "Download")*

## Install
Download the package from bower
```
bower install SlideShow --save
```

Including the file in your webpage
```HTML
<script type="text/javascript" src="/node_modules/SlideShow/js/SlideShow.js"></script>
```

See **Code Sample** below for more details.

## API
[API Document](https://github.com/Rendxx/SlideShow/blob/master/API%20Document.md)

## Dependency
- [jQuery][]

## Code Sample
JavaScript:

```javascript
$$.slideShow({
        frame: [$(".pic-1")[0],$(".pic-2")[0],$(".pic-3")[0]],
        controller: [$(".selector-1")[0],$(".selector-2")[0],$(".selector-3")[0]],
        next: $(".btn-next")[0],
        prev: $(".btn-prev")[0],
        activeClass: "actived",
        autoSwap: 5000
    });
```

## Compatibility
```Chrome``` ```Fire Fox``` ```Safari``` ```Edge``` ```IE 9-11``` ```IE 7,8```

## License
Copyright &copy; 2015, Rendxx. (MIT License)  
See [LICENSE][] for more info.

[jQuery]: https://jquery.com/ "jQuery Home Page"
[LICENSE]: https://github.com/Rendxx/SlideShow/blob/master/LICENSE