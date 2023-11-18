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
