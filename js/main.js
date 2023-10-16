/*  ---------------------------------------------------
    Template Name: Dreams
    Description: Dreams wedding template
    Author: Colorib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorib
---------------------------------------------------------  */

'use strict';

const lenis = new Lenis()

lenis.on('scroll', (e) => {
	// console.log(e)
})

function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

    /*------------------
        Preloader
    --------------------*/
	window.addEventListener('DOMContentLoaded', (event) => {

		const prelaoder = document.querySelector('.preloader');
		prelaoder.classList.add('preloader--hidden')


		/*------------------
				Portfolio filter
		--------------------*/

		const portfolioGallery = document.querySelector('.portfolio__list');

		if (portfolioGallery) {
		  const iso = new Isotope(portfolioGallery, {
		    itemSelector: '.portfolio__item',
		    layoutMode: 'fitRows'
		  });

		  // Функция для фильтрации по категории
		  function filterItems(category) {
				if (category == 'all') {
					iso.arrange({
						filter: '.portfolio__item',
					});
					return;
				}
		    iso.arrange({
		      filter: `[data-category="${category}"]`
		    });
		  }

		  // Привязка события клика на элементы фильтрации
		  const filterButtons = document.querySelectorAll('.portfolio__filter li');
		  if (filterButtons) {
		    filterButtons.forEach((button) => {
		      button.addEventListener('click', () => {
		      	filterButtons.forEach(filterButton => {
		      		filterButton.classList.remove('active');
		      	});
		      	button.classList.add('active');
		        const category = button.dataset.category;
		        filterItems(category);
		      });
		    });
		  }
			//*/
		}
	});

    /*------------------
        Background Set
    --------------------*/
		const setBgItems = document.querySelectorAll('.set-bg');
		setBgItems.forEach(item => {
			const bg = item.dataset.setbg;
			item.style.backgroundImage = `url(./${bg})`;
		})


    /*------------------
		Navigation
	--------------------*/
    // $(".mobile-menu").slicknav({
    //     prependTo: '#mobile-menu-wrap',
    //     allowParentLinks: true
    // });
		const burger = document.querySelector('.burger');
		const header = document.querySelector('.header')
		burger.addEventListener('click', () => {
			header.classList.toggle('header--opened')
		})




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


		gsap.registerPlugin(ScrollTrigger);

		//#region gsapHorizontalScroll

		/**
		 * Services carousel
		 */

		const servicesGallery = document.querySelector('.services__gallery');
		const servicesCards = [...document.querySelectorAll('.services__item')];
		const servicesTimeline = gsap.timeline({
				scrollTrigger: {
					markers: true,
					trigger: servicesGallery,
					scrub: 0.5,
					pin: true,
					start: `center center`,
					end: `+=${50 * servicesCards.length}%`,
				}
			}
		);

		function getSerivcesToOffsetX() {
			const cards = [...document.querySelectorAll('.services__item')];
			let marginRight = null;
			const width = cards.reduce((total, card, index) => {
				if (marginRight == null) {
					marginRight = +window.getComputedStyle(card).marginRight.replace('px', '');
				}

				let cardWidth = card.getBoundingClientRect().width;
				if (index === 0) {
					cardWidth *= 2;
				}

				return total += cardWidth + marginRight;
			}, 0)

			return -width;
		}

		function getServicesFromOffsetX() {
			const cards = [...document.querySelectorAll('.services__item')];
			let marginRight = null;
			let cardsCount = 2;
			if (window.innerWidth <= 610) {
				cardsCount = 1
			}
			const width = cards.reduce((total, card, index) => {
				if (index > cardsCount) return total + 0;

				if (marginRight == null) {
					marginRight = +window.getComputedStyle(card).marginRight.replace('px', '');
				}

				let cardWidth = card.getBoundingClientRect().width;
				if (index === 0) {
					cardWidth *= 1.14;
				}

				return total += cardWidth + marginRight;
			}, 0)

			return width;
		}

		// /*
		servicesTimeline.fromTo(
			servicesGallery.querySelector('.services__list'),
			{
				x: getServicesFromOffsetX()
			},
			{
				x: getSerivcesToOffsetX()
			},
			'<'
		);
		// */

		//#endregion gsapHorizontalScroll


		//#region scrubTitles

		const sectionTitles = document.querySelectorAll('.section-title-animated');
		sectionTitles.forEach((title, index) => {
			if (title.innerText != '') return;

			let startOffset = 20;
			if (title.dataset.startOffset) {
				startOffset = parseInt(title.dataset.startOffset, 10);
			}

			let timelineConfig = {
				scrollTrigger: {
					// markers: true,
					trigger: title,
					scrub: true,
					pin: true,
					start: `top-=${20 + startOffset}% center`,
					end: `bottom bottom-=27%`,
				}
			}
			const timeline = gsap.timeline(timelineConfig);
			let yPercentModifier = 0;
			if (title.dataset.yModifier) {
				yPercentModifier = parseInt(title.dataset.yModifier, 10);
			}
			console.log(title.innerText, yPercentModifier);

			timeline.fromTo(
				title.querySelector('.section-title'),
				{
					opacity: 0,
					scale: 0.8,
					yPercent: -300,
				},
				{
					opacity: 1,
					scale: 1,
					yPercent: -190 + yPercentModifier,
				},
			);
		});

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

		function getTopOffset(percents = 100) {
				return window.innerHeight / 100 * percents;
		}

		function scrollTosectionToScroll(percents = 9) {
				const linkElems = document.querySelectorAll('[href^="#"]')
				if (!linkElems) return;
				for (let i = 0; i < linkElems.length; i++) {
						const link = linkElems[i];
						link.addEventListener('click', (e) => {
								e.preventDefault()
								let href = link.getAttribute('href')
								if (!href || href == "#") return;
								let sectionToScroll = document.querySelector(href)
								if (!sectionToScroll) return;

								window.scroll({
										top: sectionToScroll.getBoundingClientRect().top + pageYOffset - getTopOffset(percents),
										left: 0,
										behavior: 'smooth'
								})
						})
				}
		}
		scrollTosectionToScroll(0);

		//#endregion sectionParallax
