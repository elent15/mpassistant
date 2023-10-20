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
