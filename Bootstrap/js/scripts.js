// Play -pause carousel
// $(document).ready( function(){
//     $('#mycarousel').carousel({interval:2000});
//     $('#carousel-pause').click(function(){
//         $('#mycarousel').carousel('pause');
//     });
//     $('#carousel-play').click(function(){
//         $('#mycarousel').carousel('cycle')
//     })
// })
// Single button carousel play/pause
// $(document).ready(function(){
//     $('#mycarousel').carousel({interval:2000});
//     $('#carouselButton').click(function(){
//         if ($('#carousel-button-icon').hasClass('fa-pause')) {
//             $('#mycarousel').carousel('pause');
//             $('#carousel-button-icon').removeClass('fa-pause');
//             $('#carousel-button-icon').addClass('fa-play');
//         }
//         else if ($('#carousel-button-icon').hasClass('fa-play')) {
//             $('#mycarousel').carousel('cycle');
//             $('#carousel-button-icon').removeClass('fa-play');
//             $('#carousel-button-icon').addClass('fa-pause');
//         }
//     })
// })
// Code as given in the course
$('document').ready(function(){
    $('#mycarousel').carousel({interval:2000});
    $('#carouselButton').click(function(){
        if ($('#carouselButton').children('span').hasClass('fa-pause')){
            $('#mycarousel').carousel('pause');
            $('#carouselButton').children('span').removeClass('fa-pause');
            $('#carouselButton').children('span').addClass('fa-play');
        } 
        else if ($('#carouselButton').children('span').hasClass('fa-play')){
            $('#mycarousel').carousel('cycle');
            $('#carouselButton').children('span').removeClass('fa-play');
            $('#carouselButton').children('span').addClass('fa-pause');
        } 
    })
})

//Js code to enable modals on clicking the respective links
$('document').ready(function(){
    $('#reserveButton').click(function(){
        $('#reservetablemodal').modal('show');
    })
    $('#loginButton').click(function(){
        $('#loginModal').modal('show');
    })
})