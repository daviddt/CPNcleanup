// name space
var CPN = (function($){

    // Initialisation Functions (Don't forget var)
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

		if ($('.accordion').length) {
			accordion.init();
		};
    };

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
    				that.current = 0
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

    var accordion = {
    	duration: 500,
    	init: function() {

    		var that = this;

    		$('body').on('click', '.accordion h2', function(event){
    			event.preventDefault();

    			console.log(event);

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

    // Function calls
    init();

    $(function(){

    	// init DOM functions
        domInit();

    });

    // if you want to call those functions 
    // some time later from outside of app, 
    // return them:
    return {
    	relatedLinks: relatedLinks
    };

})(jQuery);

