// слайдер на мобильной версии сайта
const slider = document.querySelector('.mobile-swiper');
let mySwiper;
function mobileSlider() {

  if (document.documentElement.clientWidth <= 710 && slider.dataset.mobile == 'false') {
      mySwiper = new Swiper(slider, {
      slidesPerView: 'auto',
      keyboard: true,
      breakpoints: {
        320: {
          spaceBetween: 8,
        },
        541: {
          spaceBetween: 16,
        }
      }
    });

    slider.dataset.mobile = 'true';
  }

  if (document.documentElement.clientWidth > 710) {
    slider.dataset.mobile = 'false';

    if (slider.classList.contains('swiper-initialized')) {
      mySwiper.destroy();
    }
  }
}

mobileSlider();

window.addEventListener('resize', () => {
  mobileSlider();
});
