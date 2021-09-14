document.addEventListener("DOMContentLoaded", function (event) {
  $("#slider").slick({
    slidesToShow: 5,
    slidesToScroll: 3,
    nextArrow: ".slider__arrow-right",
    prevArrow: ".slider__arrow-left",

    responsive: [
      {
        breakpoint: 1240,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  });

  var currentX = "";
  var currentY = "";
  var movementConstant = 0.015;
  $(document).mousemove(function (e) {
    if (currentX == "") currentX = e.pageX;
    var xdiff = e.pageX - currentX;
    currentX = e.pageX;
    if (currentY == "") currentY = e.pageY;
    var ydiff = e.pageY - currentY;
    currentY = e.pageY;
    $(".parallax img").each(function (i, el) {
      var movement = (i + 1) * (xdiff * movementConstant);
      var movementy = (i + 1) * (ydiff * movementConstant);
      var newX = $(el).position().left + movement;
      var newY = $(el).position().top + movementy;
      $(el).css("left", newX + "px");
      $(el).css("top", newY + "px");
    });
  });
});
