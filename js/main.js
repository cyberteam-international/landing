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


		//#region gsapHorizontalScroll

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
			if (window.innerWidth <= 610) return 0;

			const SERVICES_CARD = servicesList.querySelector('.services__item');
			let offsetCardsCount = 2;

			return offsetCardsCount * SERVICES_CARD.getBoundingClientRect().width
		}

		function getSrevicesToOffsetX() {
			let cardsCountModifer = -1.35;
			if (window.innerWidth <= 610) {
				cardsCountModifer = -0.5;
			}

			return 0 - (getServicesListScrollTriggerEnd(cardsCountModifer));
		}

		function getServicesOffsetStartModifier() {
			const cardsHeight = servicesList.getBoundingClientRect().height;
			const card = servicesList.querySelector('.services__item');
			const cardMarginBottom = +window.getComputedStyle(card).marginBottom.replace('px', '');
			const offsetModifier = (window.innerHeight - cardsHeight + cardMarginBottom) / 2;
			return offsetModifier;
		}

		const servicesCardsTimeline = gsap.timeline({
			scrollTrigger: {
				// markers: true, // маркеры для отладки старта и конца
				trigger: servicesList, // Установите триггером ваш контейнер галереи
				scrub: true, // Разрешите pin scrub
				pin: true, // Закрепите элемент в начале контейнера
				start: `top-=${getServicesOffsetStartModifier()} top`, // Начало анимации pin scrub
				end: `bottom+=${getServicesListScrollTriggerEnd(2)} bottom`, // Конец анимации pin scrub, основанный на ширине контейнера
			}
		});

		servicesCardsTimeline.fromTo(servicesList, {x: getServicesFromOffsetX}, {x: getSrevicesToOffsetX})
		//#endregion gsapHorizontalScroll


		//#region scrubTitles

		const sectionTitles = document.querySelectorAll('.section-title');
		sectionTitles.forEach((title, index) => {
			console.log(title.innerText);
			let timelineConfig = {
				scrollTrigger: {
					markers: true,
					trigger: title,
					scrub: true,
					pin: true,
					start: `top center`,
					end: `bottom-=50% center`,
				}
			}
			const timeline = gsap.timeline(timelineConfig);

			timeline.fromTo(title,
				{
					alpha: 0,
					scale: 0.4,
					// yPercent: -150
					yPercent: 0
				},
				{
					alpha: 1,
					scale: 1,
					yPercent: 0
				}
			);
		})

		//#endregion scrubTitles


		//#region sectionParallax

		/**
		 * Parallax bg on sections
		 */

		function isSectionFirstScreen(section) {
			return section.offsetTop < (window.innerHeight / 2);
		}

		const parallaxSections  = document.querySelectorAll('.b_parallax');
		parallaxSections.forEach((section, index) => {
			const bg = section.querySelector('.b_parallax__bg');

			let sectionFirstScreen = isSectionFirstScreen(section)
			let timelineConfig = {
				scrollTrigger: {
					trigger: section,
					scrub: true,
					start: `top bottom`,
					end: `bottom+=20% top`,
				}
			}

			if (index == 0) {
				// timelineConfig.scrollTrigger.markers = true;
			}

			if (sectionFirstScreen) {
				timelineConfig.scrollTrigger.start = 'top top';
				timelineConfig.scrollTrigger.end = 'bottom+=40% top';
			}

			const timeline = gsap.timeline(timelineConfig);

			let sectionFrom = sectionFirstScreen ? 0 : -70;
			let sectionTo = window.innerWidth <= 610 ? 20 : 50;

			timeline.fromTo(bg, {yPercent: sectionFrom}, {yPercent: sectionTo});
		})

		//#endregion sectionParallax

})(jQuery);
