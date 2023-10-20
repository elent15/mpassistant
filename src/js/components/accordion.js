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
