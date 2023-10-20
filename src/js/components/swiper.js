new Swiper('.reviews-swiper', {
  navigation: {
    nextEl: '.reviews-swiper-button-next',
    prevEl: '.reviews-swiper-button-prev',
  },
  pagination: {
    el: '.reviews-swiper-pagination',
    clickable: true,
  },
  keyboard: true,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    781: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
  }
});
