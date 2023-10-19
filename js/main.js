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
function raf(time) {
	lenis.raf(time)
	requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// lenis.on('scroll', (e) => {
// 	// console.log(e)
// })

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

		let servicesScrollerStartModifier = 20;
		if (window.innerWidth < 610) {
			servicesScrollerStartModifier = 0;
		}


		const servicesTimelineConfig = {
			scrollTrigger: {
				// markers: true,
				trigger: servicesGallery.closest('.services'),
				scrub: 0.5,
				pin: true,
				start: `center center`,
				end: `+=${50 * servicesCards.length}%`,
			}
		}
		const servicesTimeline = gsap.timeline(servicesTimelineConfig);

		function getSerivcesToOffsetX() {
			const cards = [...document.querySelectorAll('.services__item')];
			let marginRight = 0;
			const width = cards.reduce((total, card, index) => {
				let cardsCountModifier = 3;
				if (window.innerWidth <= 610) {
					cardsCountModifier = 1;
				}
				if (index >= cards.length - cardsCountModifier) return total += 0;


				if (marginRight == 0) marginRight = parseInt(window.getComputedStyle(card).marginRight, 10);

				let cardWidth = card.getBoundingClientRect().width;
				if (window.innerWidth <= 610) {
					if (index == cards.length - 2) {
						marginRight = 0;
					}
				}

				/*
				if (index === 0) {
					// cardWidth *= 1.15;
				} else if (index == cards.length - 1) {
					// cardWidth *= 2;
					cardWidth *= 2;
					if (window.innerWidth <= 610) {
						cardWidth *= 0.495;
					}
				}
				*/

				return total += cardWidth + marginRight;
			}, 0)

			return -width;
		}

		function getServicesFromOffsetX() {
			const cards = [...document.querySelectorAll('.services__item')];
			let marginRight = null;
			let cardsCount = 2;
			if (window.innerWidth <= 610) {
				cardsCount = 0;
			}
			const width = cards.reduce((total, card, index) => {
				if (index > cardsCount) return total + 0;

				if (marginRight == null) {
					marginRight = +window.getComputedStyle(card).marginRight.replace('px', '');
				}

				let cardWidth = card.getBoundingClientRect().width;
				if (index === 0) {
					// cardWidth *= 1.14;
					cardWidth *= 2;
					if (window.innerWidth <= 610) {
						cardWidth *= 0;
					}
				}

				return total += cardWidth + marginRight;
			}, 0)

			return width;
		}

		// let servicesToPercentY = -60;
		let servicesToPercentY = 0;
		if (window.innerWidth < 610) {
			servicesToPercentY = - 10;
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
			// if (title.innerText != '') return;

			let stepsStart = 1;
			if (title.dataset.stepsStart) {
				stepsStart = parseInt(title.dataset.stepsStart, 10);
				if (window.innerWidth <= 610) {
					stepsStart/= 2;
				}
			}

			let stepsEnd = 0.5;
			if (title.dataset.stepsEnd) {
				stepsEnd = parseInt(title.dataset.stepsEnd, 10);
				if (window.innerWidth <= 610) {
					stepsEnd/= 3;
				}
			}

			let titleTimelineConfig = {
				scrollTrigger: {
					// markers: true,
					trigger: title,
					scrub: true,
					start: `center-=${100 * stepsStart}% center`,
					end: `bottom+=${100 * stepsEnd}% center`,
				}
			}
			const titleTimeline = gsap.timeline(titleTimelineConfig);

			let stepsFrom = 1;
			if (title.dataset.stepsFrom) {
				stepsFrom = parseInt(title.dataset.stepsFrom, 10);
				if (window.innerWidth <= 610) {
					stepsFrom/= 2;
				}
			}

			let stepsTo = 0;
			if (title.dataset.stepsTo) {
				stepsTo = parseInt(title.dataset.stepsTo, 10);
				if (window.innerWidth <= 610) {
				}
			}

			titleTimeline.fromTo(
				title.querySelector('.section-title'),
				{
					opacity: 0,
					// scale: 0.9,
					yPercent: -100 * stepsFrom,
					// yPercent: -300,
				},
				{
					opacity: 1,
					// scale: 1,
					// yPercent: 0,
					yPercent: 100 * stepsTo,
					// yPercent: -190,
					duration: 4,
				},
				{ overscroll: 10, },
			);

			// console.log(title.closest('.services'));
			if (title.closest('.services')) {
				titleTimeline.fromTo(document.querySelector('.services__gallery'), {
					opacity: 0
				}, {
					opacity: 1
				}, ">-1.5");
			// 	titleTimeline.to(title, {
			// 		opacity: 0,
			// 		yPercent: -100 * stepsFrom,
			// 	}, ">-1.5")
			}
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
			let parallaxTimelineConfig = {
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
				parallaxTimelineConfig.scrollTrigger.start = 'top top';
				parallaxTimelineConfig.scrollTrigger.end = 'bottom+=40% top';
			}

			const parallaxTimeline = gsap.timeline(parallaxTimelineConfig);

			let sectionFrom = sectionFirstScreen ? 0 : -70;
			let sectionTo = window.innerWidth <= 610 ? 20 : 50;

			parallaxTimeline.fromTo(bg, {yPercent: sectionFrom}, {yPercent: sectionTo});
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



		//#region portfolioList

		const portfolioList = document.querySelector('.portfolio-gallery');

		const portfoiloListTimelineConfig = {
			scrollTrigger: {
				// markers: true,
				trigger: portfolioList,
				scrub: 0.5,
				start: `top+500 bottom`,
				end: `top+=800 bottom`,
			}
		}
		const portfolioListTimeline = gsap.timeline(portfoiloListTimelineConfig);

		portfolioListTimeline.fromTo(
			portfolioList,
			{
				y: 200,
				opacity: 0
			},
			{
				y: 0,
				opacity: 1,
			},
			'<'
		);
		// */

		//#endregion portfolioList

	});
