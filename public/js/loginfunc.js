
$('.drop-toggle').click(function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).closest('.search-drop').toggleClass('open');
});

$('.drop-menu > li > a').click(function(e) {
  e.preventDefault();
  var clicked = $(this);
 // clicked.closest('.dropdown-menu').find('.menu-active').removeClass('menu-active');
  //clicked.parent('li').addClass('menu-active');
  clicked.closest('.search-drop').find('.toggle-active').html(clicked.html());
});

$(document).click(function() {
  $('.search-drop.open').removeClass('open');
});