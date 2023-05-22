'use strict';

import { gsap, ScrollTrigger } from "gsap/all";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

(function () {
  const
    $html = document.querySelector('html'),
    $body = document.querySelector('body'),
    isTouch = (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement),
    plugins = {
      sliderContainer: document.querySelectorAll('.slider-list'),
      tabs: document.querySelectorAll( '.tabs' ),
      founderSlider: document.querySelector('.swiper-founder'),
      getInTouchForm: document.querySelector('#getInTouchForm'),
      copyrightYear: document.querySelectorAll('.copyright-year'),
      cursor: document.querySelector('.cursor'),
    }

  window.addEventListener('load', () => {
    if (plugins.sliderContainer.length) {
      plugins.sliderContainer.forEach(node => {
        const
          list = node,
          clone = list.cloneNode(true);

        list.parentElement.appendChild(clone);

        const update = () => {
          list.parentElement.style.setProperty("width", `${list.scrollWidth}px`)
          list.parentElement.style.setProperty("animation-duration", `${list.scrollWidth / window.innerWidth * 5}s`)
        }

        update()
        window.onresize = update
      })
    }
  });
  if (isTouch) {
    $html.classList.add('touch-device')
  }

  if (plugins.cursor) {
    const cursor = plugins.cursor;

    if (!isTouch) {
      $html.classList.add('is-cursor');

      window.addEventListener('mousemove', event => {
        cursor.style.setProperty('left', `${event.clientX}px`);
        cursor.style.setProperty('top', `${event.clientY}px`);
        if (
          event.target.closest('.cursor_activation') ||
          event.target.closest('.tabs__nav') ||
          event.target.closest('.swiper-pagination-bullet') ||
          event.target.closest('LABEL') ||
          event.target.closest('A') ||
          event.target.closest('BUTTON') ||
          event.target.closest('INPUT') ||
          event.target.closest('TEXTAREA')
        ) {
          cursor.classList.add('cursor_active')
        }
        else {
          cursor.classList.remove('cursor_active')
        }
      })
    }

    if (isTouch) {
      cursor.remove();
    }
  }

  if (plugins.tabs.length) {
    function Tabs ( options ) {
      this.node = options.node;
      this.links = options.node.querySelectorAll( '.tab-link' );
      this.windows = options.node.querySelectorAll( '.tab' );
      this.activeIndex = 0;
      this.initColled = false;

      this.node.tabs = this;

      this.init();
    }

    Tabs.prototype.init = function () {
      if ( !this.initColled ) {
        for ( let i = 0; i < this.links.length; i++ ) {
          this.link = this.links[i];
          this.handlerClick( this.link, i )

          this.windows[i].style.display = 'none'
          this.windows[0].style.display = 'block'
          this.links[0].classList.add( 'active' )
        }
      }
    };

    Tabs.prototype.handlerClick = function ( link, index ) {
      link.addEventListener( 'click', function (event) {
        event.preventDefault();
        this.goToTab( index )
      }.bind( this ))
    };

    Tabs.prototype.goToTab = function ( index ) {
      if ( index !== this.activeIndex && index >= 0 && index <= this.links.length ) {
        this.links[ this.activeIndex ].classList.remove( 'active' );
        this.links[ index ].classList.add( 'active' );
        this.windows[ this.activeIndex ].style.display = 'none'
        this.windows[ index ].style.display = 'block'
        this.activeIndex = index;
      }
    };

    plugins.tabs.forEach(node => {
      new Tabs({ node: node });
    })
  }

  if (plugins.founderSlider) {
    const slider = new Swiper(plugins.founderSlider, {
      slidesPerView: 1,
      spaceBetween: 33,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: function (swiper, current, total) {
          return ("0" + current).slice(-2) + "/" + ("0" + total).slice(-2);
        },
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 104,
        },
      },
    })
  }

  if (plugins.getInTouchForm) {
    const
      form = plugins.getInTouchForm,
      inputWrap = document.querySelector('.input-wrap'),
      successMessage = document.querySelector('.success-message');

    const onSubmit = (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('form-validated');
        return
      }

      const
        input = form.querySelector('input[name="email"]'),
        formData = new FormData(form),
        url = 'https://reqbin.com/echo/post/json',
        params = {
          email: formData.get('email')
        };

      let xhr = new XMLHttpRequest();

      xhr.open("POST", url);

      xhr.onload = () => {
        if (xhr.status === 200) {
          inputWrap.classList.add('hide')
          successMessage.classList.add('show')
        }
      };

      xhr.send(JSON.stringify(params))

      input.value = ''

    }

    form.addEventListener('submit', onSubmit)
  }

  if (plugins.copyrightYear.length) {
    plugins.copyrightYear.forEach(node => {
      node.textContent = new Date().getFullYear();
    })
  }

  function MobileNav() {
    const navopener = document.querySelectorAll(".nav-opener"),
          navwrap = document.querySelector(".nav-slide"),
          links = navwrap.querySelectorAll("a"),
          navactive = "nav-active",
          mainNavItems = document.querySelectorAll('.main-nav li');

    navopener.forEach(node => {
      node.addEventListener('click', () => {
        $body.classList.toggle(navactive)
      })
    })

    mainNavItems.forEach(function(item) {
      const drop = item.querySelector('ul'),
            link = item.querySelector('a');
      if (drop) {
        item.classList.add('hasdrop');
        if (link) {
          link.classList.add('hasdrop-a');
          link.setAttribute('data-more', '');
          link.setAttribute('data-outside', '');
        }
      }
    });

    links.forEach(node => {
      node.addEventListener('click', () => {
        node.classList.contains('hasdrop-a') ? false : $body.classList.remove(navactive);
      })
    })

    document.documentElement.addEventListener('click', handleClick);
    document.documentElement.addEventListener('touchstart', handleClick);
    document.documentElement.addEventListener('pointerdown', handleClick);
    document.documentElement.addEventListener('MSPointerDown', handleClick);

    function handleClick(e) {
      const target = e.target;

      if (Array.from(navopener).every(function(node) {
        return !node.contains(target);
      })) {
        document.body.classList.remove(navactive);
      }
    }
  }
  MobileNav();

  gsap.registerPlugin(ScrollTrigger)

  gsap.to(".bg-work-with-us-el", {
    scrollTrigger: {
      trigger: '.work-with-us',
      scrub: true
    },
    y: (i, target) => {
      return -ScrollTrigger.maxScroll(window) * target.dataset.speed * .1
    }
  });

  gsap.to(".hero-text-parallax", {
    scrollTrigger: {
      scrub: true
    },
    y: (i, target) => {
      return -ScrollTrigger.maxScroll(window) * target.dataset.speed * .1
    }
  });
}());
