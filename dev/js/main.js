// аккордеон
const accordion = () => {
  const accordions = document.querySelectorAll('.accordion-js');

  accordions.forEach(accordion => {
    accordion.addEventListener('click', (el) => {
      const self = el.currentTarget;
      const trigger = self.querySelector('.accordion-trigger-js');
      const content = self.querySelector('.accordion-content-js');

      if (self.classList.contains('accordion')) {
        self.classList.toggle('accordion--active');
      } else if (self.classList.contains('opportunities__accordion')) {
        self.classList.toggle('opportunities__accordion--active');
      }

      if (self.classList.contains('accordion--active') || self.classList.contains('opprotunities__accordion--active')) {
        trigger.setAttribute('aria-expanded', true);
        content.setAttribute('aria-hidden', false);
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        trigger.setAttribute('aria-expanded', false);
        content.setAttribute('aria-hidden', true);
        content.style.maxHeight = null;
      }
    });
  });
}

accordion();

// бургер-меню
const burger = () => {
  const burger = document.querySelector('.burger');
  const header = document.querySelector('.header__container');
  const menu = document.querySelector('.header__nav');
  const menuItems = document.querySelectorAll('.header__nav-item');

  burger.addEventListener('click', () => {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('header__nav--active');
    header.classList.toggle('header__container--active');

    if (menu.classList.contains('header__nav--active')) {
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Закрыть меню');
      document.body.classList.add('stop-scroll');
    } else {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      document.body.classList.remove('stop-scroll');
    }
  });

  menuItems.forEach(el => {
    el.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      burger.classList.remove('burger--active');
      menu.classList.remove('header__nav--active');
      header.classList.remove('header__container--active');
      document.body.classList.remove('stop-scroll');
    });
  });
}

burger();

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

// модальное окно
const modal = () => {
  const btns = Array.from(document.querySelectorAll(`[data-modal]`));
  const modals = Array.from(document.querySelectorAll('.modal'));
  const inputs = document.querySelectorAll('.modal__form-input');
  const body = document.body;
  const header = document.querySelector('.header__container');
  const menu = document.querySelector('.header__nav');
  const burger = document.querySelector('.burger');

  function open(el) {
    modals.forEach(modal => {
      if (modal.classList.contains('modal--open'))
        modal.classList.remove('modal--open');
    });

    if (menu.classList.contains('header__nav--active')) {
      header.classList.remove('header__container--active');
      menu.classList.remove('header__nav--active');
      burger.classList.remove('burger--active');
    }

    const modalData = el.target.dataset.modal || el.target.closest(`[data-modal]`).dataset.modal;
    const modal = document.getElementById(`${modalData}`);
    const modalClose = modal.querySelector('.modal__close-btn');

    modal.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', btn => {
        btn.preventDefault();
      });
    });

    modalClose.classList.remove('modal__close-btn--active');
    modal.classList.add('modal--open');
    body.classList.add('stop-scroll');
  }

  function close(el) {
    const target = el.target;
    const modal = target.closest('.modal');
    const modalBody = modal.querySelector('.modal__body');
    const modalClose = modal.querySelector('.modal__close-btn');
    const modalBtn = modal.querySelector('.btn-js');

    const itsModalBody = target == modalBody || modalBody.contains(target);
    const itsModalClose = target == modalClose || modalClose.contains(target);
    const itsModalBtn = target == modalBtn || modalBtn.contains(target);

    if ((itsModalClose && modal.classList.contains('modal--open')) ||
      (!itsModalBody && modal.classList.contains('modal--open')) ||
      (itsModalBtn && modal.classList.contains('modal--open'))) {
      modalClose.classList.add('modal__close-btn--active');
      modal.classList.remove('modal--open');
      body.classList.remove('stop-scroll');
      inputs.forEach(input => {
        input.value = '';
      });
    }
  }

  btns.forEach(btn => {
    btn.addEventListener('click', open);
  });

  modals.forEach(modal => {
    modal.addEventListener('click', close);
  });
}

modal();

// кнопка "Читать полностью"
const read = () => {
  const readBtn = document.querySelectorAll('.reviews__btn--active');

  readBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('reviews__btn--open');
      const reviewsCard = btn.closest('.reviews__card');
      const reviewsText = reviewsCard.querySelector('.reviews__card-text');
      reviewsText.classList.toggle('reviews__card-text--open');
      const reviewsBottom = reviewsCard.querySelector('.reviews__card-bottom');
      reviewsBottom.classList.toggle('reviews__card-bottom--close');
    });
  });
}

read();

// слайдер
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

// табы
const tabs = () => {
  const tabs = Array.from(document.querySelectorAll('.tabs'));
  let btnActive;
  let tabActive;

  tabs.forEach(tabs => {
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const tabsData = e.target.dataset.tab;

        if (tabsData) {
          const tabsBtn = Array.from(tabs.querySelectorAll('.tabs__btn'));
          const parent = e.target.closest('.tabs-block');
          const tabsContent = Array.from(parent.querySelectorAll('.tab'));

          if (parent.classList.contains('opportunities__tabs-block')) {
            btnActive = 'opportunities__tabs-btn--active';
            tabActive = 'opportunities__tab--active';
          } else if (parent.classList.contains('tariff__tabs-block')) {
            btnActive = 'tariff__tabs-btn--active';
            tabActive = 'tariff__tab--active';
          }

          tabsBtn.forEach(btn => {
            btn.classList.remove(btnActive);
          });

          tabs.querySelector(`[data-tab='${tabsData}']`).classList.add(btnActive);

          tabsContent.forEach(tab => {
            tab.classList.remove(tabActive);
          });

          document.getElementById(`${tabsData}`).classList.add(tabActive);
        }
      });
    }
  });

}

tabs();
