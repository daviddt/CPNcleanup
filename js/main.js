// name space
var CPN = (function($){

    // Initialisation Functions
    var init = function () {
        // init stuff
    };
    var domInit = function () {
        // DOM Ready stuff here

        // Set position fixed to top bar
        $(window).scroll(function () {

		    if ($(window).scrollTop() > 50) {
		        $('#header').addClass('fixed');
		        $('#breadcrumb').addClass('fixed');
		    } else {
		        $('#header').removeClass('fixed');
		        $('#breadcrumb').removeClass('fixed');
		    }
		});

        // main navigation, add class on hover
		$("#main-navigation ul li").hover(function() {
		        $(this).addClass("hover");
		    }, function() {
		    	$(this).removeClass("hover");
		    }
		);

		// if more then 1 related link, init related links animation
		if ($('#related-links ul').length > 1) {
			relatedLinks.init();
		};

        // accordion
		if ($('.accordion').length) {
			accordion.init();
		};

        //showcase 
        $('#showcase').click(function(event){
            event.preventDefault();
            if (!$('#showcase-container').length) {
                showcase.init($('#showcase').data('showcase'));
            };
        });
    }; // end dom init
        

    // related links js
    var relatedLinks = {
    	current: 0,
    	container: $('.related-links-inner-wrapper'),
    	relatedLinksLength: $('#related-links ul').length,
    	init: function () {
    		this.setNavigation();
    		this.startAnimation();
    	},
    	startAnimation: function() {
    		var that = this;
    		this.intervalID = window.setInterval(function(){
    			if (that.current + 1 < that.relatedLinksLength) {
    				that.container.css({'left': -(that.current + 1) * 290});
    				that.current++;
    			} else {
    				that.container.css({'left': 0});
    				that.current = 0;
    			}
    			$('#related-links .dots a').removeClass('active');
    		    $('#related-links .dots a').eq(that.current).addClass('active');
    		}, 5000);
    	},
    	animateTo: function (to) {
    		if (this.intervalID) clearInterval(this.intervalID);
    		this.container.css({'left': -(to) * 290});
    	    this.current = to;
    	    this.startAnimation();
    	},
    	setNavigation: function () {
    		var dots = '<div class="dots">';

    		for (var i = 0; i < this.relatedLinksLength; i++) {
    			dots += '<a href="#" data-link="'+i+'"></a>';
    		}

    		dots += '</div>';

    		$('.related-links-outer-wrapper').after(dots);
    		$('#related-links .dots a').eq(0).addClass('active');

    		$('body').on('click', '#related-links .dots a', function(event){
    			event.preventDefault();

    			$('#related-links .dots a').removeClass('active');
    			$(this).addClass('active');

    			relatedLinks.animateTo($(this).data('link'));
    		});
    	}

    };

    // accordion js
    var accordion = {
    	duration: 500,
    	init: function() {

    		var that = this;

    		$('body').on('click', '.accordion h2', function(event){
    			event.preventDefault();

    			var parent = $(this).parent('.slider');

    			if (parent.find('.content').css('display') === 'block') {
    				parent.removeClass('active');
    				parent.find('.content').slideUp(that.duration);
    			} else {

    				if ($('.slider.active').length) {
    					$('.slider.active .content').slideUp(that.duration);
    					$('.slider.active').removeClass('active');
    				}

    				parent.addClass('active');
    				parent.find('.content').slideDown(that.duration);
    			}

    		});
    	}
    };

    // showcase
    var showcase = {
        current: 0,
        items: null,
        prevPosition: 0,
        init: function (json) {
            $.get(json, function(data) {
                showcase.createHTML(JSON.parse(data));
            });
        },
        createHTML: function(stories) {
            this.items = stories;
            var html = '<div id="showcase-container">';
                html += '<div class="inner-wrapper"><span class="close">X CLOSE</span><div class="gallery-container">';
                html += '<h1>'+stories.channel.item[0].copyright+'</h1>';
                html += '<div class="image-wrapper"><div class="overlay"></div><img src="'+stories.channel.item[0]['content']['@url']+'"><p class="description">'+stories.channel.item[0].description+'</p></div>';
                html += '<div class="gallery-info clear"><p class="about">ABOUT THIS PICTURE</p><p class="copyright">'+stories.channel.item[0].copyright+'</p><div class="gallery-navigation"><div class="counter"><span class="arrow-left"></span><span class="arrow-right"></span><span class="current">01</span><span class="of">OF</span><span class="total">'+stories.channel.item.length+'</span></div></div></div>';
                html += '</div></div></div>';

            $('.wrapper.main').after(html);

            this.bindGallery();
            this.showShowcase();
        },
        bindGallery: function() {

            var that = this;

            $('body').on('mouseenter', '#showcase-container .about', function(){
                $('#showcase-container .image-wrapper').addClass('active');
            });

            $('body').on('mouseleave', '#showcase-container .about', function(){
                $('#showcase-container .image-wrapper').removeClass('active');
            });

            $('body').on('click', '#showcase-container .arrow-left', function(){
                if (that.current > 0) {
                    that.current--;
                    that.setNewImage(that.current);
                };
            });

             $('body').on('click', '#showcase-container .arrow-right', function(){
                if (that.current < that.items.channel.item.length) {
                    that.current++;
                    that.setNewImage(that.current);
                };
            });

            $('body').on('click', '#showcase-container .close', function(){
                that.closeGallery();
            });

        },
        setNewImage: function(position) {

            var oldImage = $('#showcase-container .image-wrapper img');
            var newImg = $('<img style="opacity: 0">'); 
            newImg.attr('src', this.items.channel.item[position]['content']['@url']);
            newImg.appendTo('.image-wrapper');

            newImg.animate({'opacity': 1}, 500, function(){
                oldImage.remove();
            });

            if (this.current < 9) {
                $('#showcase-container .current').text('0' + (this.current + 1)); 
            } else {
                $('#showcase-container .current').text(this.current); 
            }

            $('#showcase-container .description').text(this.items.channel.item[position].description);
            $('#showcase-container .gallery-info .copyright').text(this.items.channel.item[position].copyright);
        },
        showShowcase: function() {
           $('#showcase-container').animate({'top': '50px', 'bottom': 0}, 1000, function(){
                $(this).css('position', 'absolute');
                $('html, body').css({
                    'overflow-y': 'hidden',
                    height: $( window ).height()
                });
           });
           this.prevPosition = $(window).scrollTop();
           $("html, body").animate({ scrollTop: 0 }, 1000);
        },
        closeGallery: function() {
            var that = this;

            $('html, body').css({
                'overflow-y': 'visible',
                height: 'auto'
            });
            $('#showcase-container').css('position', 'fixed');
            $('#showcase-container').animate({'top': '100%', 'bottom': '200%'}, 1000, function(){
               $(this).remove();
            });

            $("html, body").animate({ scrollTop: that.prevPosition }, 1000);
        }
    };

    // Function calls
    init();

    $(function(){

    	// init DOM functions
        domInit();

    });

    // functions to return, to call outside of this scope
    return {
    	relatedLinks: relatedLinks
    };

})(jQuery);

