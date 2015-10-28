
$(function () {

    $$.slideShow({
        frame: $(".wrap-1").children(".picture"),
        controller: $(".wrap-1 .control").children(".selector"),
        next: $(".wrap-1 .btn-next")[0],
        prev: $(".wrap-1 .btn-prev")[0],
        activeClass: "actived",
        autoSwap: 5000
    });
});