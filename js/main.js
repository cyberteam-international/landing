/*  ---------------------------------------------------
    Template Name: Dreams
    Description: Dreams wedding template
    Author: Colorib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Portfolio filter
        --------------------*/
        $('.portfolio__filter li').on('click', function () {
            $('.portfolio__filter li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.portfolio__gallery').length > 0) {
            var containerEl = document.querySelector('.portfolio__gallery');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });



    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });




    /*------------------
        Video Popup
    --------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });



    const swiper = new Swiper('.swiper', {
        // Optional parameters
        loop: false,
        slidesPerView: 4,
        spaceBetween: 30,

        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            // when window width is >= 480px
            580: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            // when window width is >= 640px
            992: {
              slidesPerView: 3,
              spaceBetween: 40
            }
          }
    });


		/**
		 *
		 * Services carousel
		 *
		 */
		gsap.registerPlugin(ScrollTrigger);

		const servicesList = document.querySelector('.services__list');

		function getServicesListScrollTriggerEnd(lengthModifier = 0) {
			const SERVICES_CARDS = [...servicesList.querySelectorAll('.services__item')];
			if (SERVICES_CARDS.length === 0) {
				console.warn('No such cards');
				return 0;
			}

			return SERVICES_CARDS[0].getBoundingClientRect().width * (SERVICES_CARDS.length - lengthModifier);
		}

		function getServicesFromOffsetX() {
			const SERVICES_CARD = servicesList.querySelector('.services__item');
			const OFFSET_CARDS_COUNT = 2;

			return OFFSET_CARDS_COUNT * SERVICES_CARD.getBoundingClientRect().width
		}

		function getSrevicesToOffsetX() {
			return 0 - (getServicesListScrollTriggerEnd(-2));
		}

		const servicesCardsTimeline = gsap.timeline({
			scrollTrigger: {
				// markers: true, // маркеры для отладки старта и конца
				trigger: servicesList, // Установите триггером ваш контейнер галереи
				scrub: true, // Разрешите pin scrub
				pin: true, // Закрепите элемент в начале контейнера
				start: "top-=200 top", // Начало анимации pin scrub
				end: `bottom+=${getServicesListScrollTriggerEnd()} bottom`, // Конец анимации pin scrub, основанный на ширине контейнера
			}
		});

		servicesCardsTimeline.fromTo(servicesList, {x: getServicesFromOffsetX}, {x: getSrevicesToOffsetX})

})(jQuery);
