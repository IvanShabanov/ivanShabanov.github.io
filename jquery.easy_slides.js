/*
EasySlides - слидер
Autor 2017 Shabanov Ivan (Шабанов Иван)
Usage:
   

   $('.slider').EasySlides({
      'autoplay': true, 
      'timeout': 3000,
      'show': 5, //how many items not hidden
      'vertical': false,  //is vertical slider. If true slides changing by up/down mouse move
      'reverse': false, //Reverse slideк control 
      'mouseevents': true,
      'beforeshow': function () {},
      'aftershow': function () {},      
      });

*/
(function( $ ){

  $.fn.EasySlides = function( options ) {  
    var settings = $.extend( {
      'autoplay': false,
      'timeout': 3000,
      'show': 5,
      'vertical': false,
      'reverse': false,
      'mouseevents': true,
      'beforeshow': function () {},
      'aftershow': function () {},
      'steptimeout': 300
    }, options);
    return this.each(function() {        
      var this_slider = this;
      var EasySlidesTimer;
      var EasySlidesCanChange = true;
      
      var count = $(this_slider).children('*:not(.next_button, .prev_button)').length;
      var cur_slide = 0;
      var mousedowned = false;
      var need_slide = 0;
      
      while (count < settings['show']) {
        var html = $(this_slider).html();
        $(html).appendTo(this_slider);
        $(this_slider).children('.next_button:eq(0), .prev_button:eq(0)').remove();
        count = $(this_slider).children('*:not(.next_button, .prev_button)').length;
      }
      var EasySlidesLoopToNeeded = function() {
        var next;
        var left = need_slide - cur_slide;
        var right = cur_slide - need_slide
        if (left < 0) {left = left + count;}
        if (right < 0) {right = right + count;}
        if (cur_slide != need_slide) {
          if ((left) < (right)) {
            console.log('+');
            next = cur_slide + 1;
          } else {
            console.log('-');
            next = cur_slide - 1;
          }
          EasySlidesNext(next);
          setTimeout(EasySlidesLoopToNeeded, settings['steptimeout']);
        };
      }
      var EasySlidesNext = function (nextslide) {
        if (EasySlidesCanChange) {
          EasySlidesCanChange = false;
          setTimeout(function() {EasySlidesCanChange = true;}, settings['steptimeout']);
          clearTimeout(EasySlidesTimer);
          if (typeof settings['beforeshow'] == 'function') {
            settings['beforeshow'];
          };
          var i = 0;
          if (count > 0) {
            if (typeof nextslide == 'number') {
              cur_slide = nextslide;
            } else {
              cur_slide ++;
              nextslide = cur_slide;
            }
            while (cur_slide < 0) {cur_slide = cur_slide + count;}
            while (cur_slide > count) {cur_slide = cur_slide - count;}
            while (nextslide < 0) {nextslide = nextslide + count;}
            while (nextslide > count) {nextslide = nextslide - count;}
       
            i = 0;
            $(this_slider).children('*:not(.next_button, .prev_button)').each(function() {
              var cssclass = '';
              var icount = 0;
              icount = i - nextslide ;
              while (icount < 0) {
                icount = icount + count;
              };
              
              while (icount > count) {
                icount = icount - count;
              };
                   
  
              if (icount == 0) {
                cssclass = 'active';
                $(this_slider).find('.' + cssclass).removeClass(cssclass);
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
              } else if (icount < settings['show'] / 2) {
                cssclass = 'next' + icount;
                $(this_slider).find('.' + cssclass).removeClass(cssclass);
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
              } else if (icount > count - (settings['show'] / 2)) {
                cssclass = 'prev' + (count - icount);
                $(this_slider).find('.' + cssclass).removeClass(cssclass);        
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
              } else {
                $(this).addClass('hidden');
              }
              i++;
              
            });
            if (settings['autoplay']) {
              clearTimeout(EasySlidesTimer);
              EasySlidesTimer = setTimeout(function() {
                EasySlidesNext();}, 
                settings['timeout']);
            }
          }
          if (typeof settings['aftershow'] == 'function') {
            settings['aftershow'];
          };
          
        };
      };
      EasySlidesNext(0);
      $(this_slider).children(':not(.next_button, .prev_button)').click(function () {
        need_slide = $(this_slider).children().index(this);
        EasySlidesLoopToNeeded()
//        EasySlidesNext( $(this_slider).children().index(this) );
      });
      $(this_slider).find('.next_button').click(function() {
        EasySlidesCanChange = true;
        EasySlidesNext();
      });
      $(this_slider).find('.prev_button').click(function() {
        EasySlidesCanChange = true;
        cur_slide --;
        EasySlidesNext(cur_slide);
      });
      if (settings['mouseevents']) {
        var EasySliderMoved = function (xcur, ycur) {
                var p0 = $(this_slider).data('posstart'),
                    p1 = { x: xcur, y: ycur };
                if (typeof p0 === 'undefined') {
                  p0 = p1;
                  $(this_slider).data('posstart', { 
                              x: xcur, 
                              y: ycur
                              });
                }
                var d = p1.x - p0.x;
                if (settings['vertical']) {
                  d = p1.y - p0.y;
                }
                if (settings['reverse']) {
                  d = -d;
                }    
                if ((Math.abs(d) > ($(this_slider).width() / 4)) && (EasySlidesCanChange)) {
                  $(this_slider).data('posstart' , { 
                                x: xcur, 
                                y: ycur
                                });
                  
                  if (d > 0) {
                    cur_slide --;
                  } else {
                    cur_slide ++;
                  }
                  EasySlidesNext(cur_slide);
                }              
        } 
        /*События*/
        $(this_slider).bind('mousemove', function(e) {
          e.preventDefault();
          if (e.buttons > 0) {
            EasySliderMoved(e.pageX , e.pageY);
            mousedowned = true;
          } else {
            if (mousedowned) {
              EasySliderMoved(e.pageX , e.pageY);
              $(this_slider).removeData('posstart');   
              mousedowned = false;
            }
          }
        });
        $(this_slider).bind('mouseup', function(e) {
            e.preventDefault();
            if (mousedowned) {
              EasySliderMoved(e.pageX , e.pageY);
              $(this_slider).removeData('posstart');   
              mousedowned = false;
            }
        })
  
        $(this_slider).bind('touchmove', function(e) {
          e.preventDefault();
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          EasySliderMoved(touch.pageX , touch.pageY);
        });
        $(this_slider).bind('touchend', function(e) {
          e.preventDefault();
          $(this_slider).removeData('posstart');         
        });
        


/*      
        $(this_slider).bind('mousemove', function(e) {
          if (e.buttons > 0) {
            if (!mousedowned) {
              //Первое нажатие на кнопку мыши 
              var w = $(this).find('.active').width();
              if (settings['vertical']) {
                w = $(this).find('.active').height();
              }  
              $(this).data('posstart', { 
                              x: e.pageX, 
                              y: e.pageY, 
                              width: w
                              });
              mousedowned = true;
            } else {
              // Двигаеммышью с зажатой кнопкой 
              var p0 = $(this).data('posstart'),
                  p1 = { x: e.pageX, y: e.pageY },
                  d = p1.x - p0.x;
              if (settings['vertical']) {
                d = p1.y - p0.y;
              }
              if (settings['reverse']) {
                d = -d;
              }    
              if (Math.abs(d) > 50) {
                $(this).data('posstart' , { 
                              x: e.pageX, 
                              y: e.pageY, 
                              width:  p0.width
                              });

                if (d > 0) {
                  cur_slide --;
                } else {
                  cur_slide ++;
                }
                EasySlidesNext(cur_slide);
              }              
            }
          } else {
            if (mousedowned) {
              // Отжали кнопку мыши
              mousedowned = false;
              var p0 = $(this).data('posstart'),
                  p1 = { x: e.pageX, y: e.pageY },
                  d = p1.x - p0.x;
              if (settings['vertical']) {
                d = p1.y - p0.y;
              } 
              if (settings['reverse']) {
                d = -d;
              }    
              $(this).removeData('posstart');              
              if ((Math.abs(d) > (0.5 * p0.width)) || (Math.abs(d) > 50)) {
                if (d > 0) {
                  cur_slide --;
                } else {
                  cur_slide ++;
                }
                EasySlidesNext(cur_slide);
              }
            }
          }
        });
/**/
      }       
    });
  }
})( jQuery );


