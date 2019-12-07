import '../scss/style.scss';

const MOBILE_WIDTH = 320;
const MOBILE_PLUS_WIDTH = 360;
const TABLET_WIDTH = 768;
const DESKTOP_WIDTH = 1440;
let SCROLL_WIDTH;

// Узнаем ширину полосы прокрутки
{
  let div = document.createElement('div');

  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';

  // мы должны вставить элемент в документ, иначе размеры будут равны 0
  document.body.append(div);
  SCROLL_WIDTH = div.offsetWidth - div.clientWidth;
  console.log(SCROLL_WIDTH);
  div.remove();
}

// Debounce

const debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Closest polyfill
{
  (function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
      if (!this) return null;
      if (this.matches(selector)) return this;
      if (!this.parentElement) {
        return null
      } else return this.parentElement.closest(selector)
    };
  }(Element.prototype));
}

// Array.from polyfill
{
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // Свойство length метода from равно 1.
      return function from(arrayLike /*, mapFn, thisArg */ ) {
        // 1. Положим C равным значению this.
        var C = this;

        // 2. Положим items равным ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. Если mapfn равен undefined, положим mapping равным false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. иначе
          // 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Положим lenValue равным Get(items, "length").
        // 11. Положим len равным ToLength(lenValue).
        var len = toLength(items.length);

        // 13. Если IsConstructor(C) равен true, то
        // 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
        //     объекта C со списком аргументов, содержащим единственный элемент len.
        // 14. a. Иначе, положим A равным ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Положим k равным 0.
        var k = 0;
        // 17. Пока k < len, будем повторять... (шаги с a по h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Положим putStatus равным Put(A, "length", len, true).
        A.length = len;
        // 20. Вернём A.
        return A;
      };
    }());
  }
}

// Swiper
{
  let swiperContentNav,
    swiperBrandList,
    swiperTypeList,
    swiperPriceList;

  let swiperSettings = {
    slidesPerView: 'auto',
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    spaceBetween: 16,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      // when window width is >= MOBILE_PLUS_WIDTH
      360: {
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
        spaceBetween: 24,
      },
    }
  }

  let swiperSettingsNav = {
    slidesPerView: 'auto',
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,
    spaceBetween: 4,
    breakpoints: {
      // when window width is >= MOBILE_PLUS_WIDTH
      360: {
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
        spaceBetween: 8,
      },
    }
  }

  if (window.innerWidth < TABLET_WIDTH) {
    swiperBrandList = new Swiper('.brand-list', swiperSettings)
    swiperTypeList = new Swiper('.type-list', swiperSettings)
    swiperPriceList = new Swiper('.price-list', swiperSettings)
  }

  if (window.innerWidth < DESKTOP_WIDTH) {
    swiperContentNav = new Swiper('.content-nav', swiperSettingsNav);
  }

  const swiperToggle = function (evt) {
    if (window.innerWidth >= TABLET_WIDTH) {
      if (swiperBrandList) swiperBrandList.destroy();
      if (swiperTypeList) swiperTypeList.destroy();
      if (swiperPriceList) swiperPriceList.destroy();
    } else {
      swiperBrandList = new Swiper('.brand-list', swiperSettings)
      swiperTypeList = new Swiper('.type-list', swiperSettings)
      swiperPriceList = new Swiper('.price-list', swiperSettings)
    }

    if (window.innerWidth >= DESKTOP_WIDTH) {
      if (swiperContentNav) swiperContentNav.destroy();
    } else {
      swiperContentNav = new Swiper('.content-nav', swiperSettingsNav);
    }
  };

  window.addEventListener('resize', debounce(swiperToggle,
    200, false), false);
}

// Модалки и меню
{
  const body = document.body;

  const modals = {
    'modal--menu': document.querySelector('.nav'),
    'modal--contacts': document.querySelector('.modal--contacts'),
    'modal--call': document.querySelector('.modal--call'),
  }

  let openedModals = {};

  const closeAllModals = () => {
    for (let modal in openedModals) {
      modals[modal].classList.add(openedModals[modal]);
      delete openedModals[modal];
    }
    body.classList.remove('body--overlay');
    body.style.paddingRight = null;
  }

  document.addEventListener('click', (evt) => {
    if (evt.target.closest('.js-btn-modal')) {
      let btn = evt.target;
      while (!btn.classList.contains('js-btn-modal')) {
        btn = btn.parentElement;
      }
      let modalName = btn.dataset.modal;
      let modalAction = btn.dataset.modalAction;

      const closeClass = (modalName === 'modal--menu') ? 'nav--closed' : 'modal--closed';
      if (modalAction === 'open') {
        closeAllModals();
        modals[modalName].classList.remove(closeClass);
        body.classList.add('body--overlay');
        body.style.paddingRight = SCROLL_WIDTH + 'px';
        openedModals[modalName] = closeClass;
      } else if (modalAction === 'close') {
        modals[modalName].classList.add(closeClass);
        if (Object.keys(openedModals).length <= 1) {
          body.classList.remove('body--overlay');
          body.style.paddingRight = null;
        }
        delete openedModals[modalName];
      }
    }
    if (evt.target === body) {
      closeAllModals()
    }
  })
}

// See more for list
{
  let numberDisplayItems = {
    320: 'all',
    768: 6,
    1440: 8,
  }

  let currentBreakpoint;

  const moreItems = {};

  let btns = Array.from(document.querySelectorAll('.js-btn--more'));
  let lists = Array.from(document.querySelectorAll('.js-list--more'));

  lists.forEach((list) => {
    moreItems[list.dataset.moreId] = {};
    moreItems[list.dataset.moreId].listItems = Array.from(list.children);
  })
  btns.forEach((btn) => {
    moreItems[btn.dataset.moreId].btn = btn;
  })

  const toggleList = (items, btn, action, breakpoint) => {
    let displayProperty = (action === 'hide') ? 'none' : 'flex';
    if ((items.length > numberDisplayItems[breakpoint]) || numberDisplayItems[breakpoint] === 'all') {
      let number = numberDisplayItems[breakpoint] === 'all' ? items.length : numberDisplayItems[breakpoint];
      for (let i = 0; i < items.length; i++) {
        if (i < number) {
          items[i].style.display = 'flex';
        } else {
          items[i].style.display = displayProperty;
        }
      }
      if (action === 'hide') {
        btn.innerText = `Показать все (${items.length})`;
        btn.dataset.status = 'hidden';
        btn.classList.remove('btn--line--less');
        btn.classList.add('btn--line--more');
      } else {
        btn.innerText = 'Скрыть'
        btn.dataset.status = 'display';
        btn.classList.remove('btn--line--more');
        btn.classList.add('btn--line--less');
      }
    } else {
      btn.style.display = 'none';
    }
  }

  const initLists = (evt) => {
    let action;
    if (window.innerWidth >= TABLET_WIDTH && window.innerWidth < DESKTOP_WIDTH) {
      currentBreakpoint = TABLET_WIDTH;
      action = 'hide';
    } else if (window.innerWidth >= DESKTOP_WIDTH) {
      currentBreakpoint = DESKTOP_WIDTH;
      action = 'hide';
    } else {
      currentBreakpoint = MOBILE_WIDTH;
      action = 'display';
    }
    for (let list in moreItems) {
      toggleList(moreItems[list].listItems, moreItems[list].btn, action, currentBreakpoint)
    }
  }

  initLists();

  window.addEventListener('resize', debounce(initLists,
    300, false), false);

  btns.forEach((btn) => {
    btn.addEventListener('click', function () {
      let items = moreItems[this.dataset.moreId].listItems;
      let btn = this;
      let action = this.dataset.status === 'hidden' ? 'display' : 'hide';
      let breakpoint = currentBreakpoint;
      toggleList(items, btn, action, breakpoint);
    })
  })
}

// See more for text
{
  const moreItems = {};

  let btns = Array.from(document.querySelectorAll('.js-btn--more-text'));
  let blocks = Array.from(document.querySelectorAll('.js-block--more-text'));

  blocks.forEach((block) => {
    moreItems[block.dataset.moreId] = {};
    moreItems[block.dataset.moreId].block = block;
  })
  btns.forEach((btn) => {
    moreItems[btn.dataset.moreId].btn = btn;
  })

  const toggleBlock = (block, btn, action) => {
    if (action === 'hide') {
      btn.innerText = 'Читать далее';
      btn.dataset.status = 'hidden';
      btn.classList.remove('btn--line--less');
      btn.classList.add('btn--line--more');
      block.style.cssText = '';
    } else {
      btn.innerText = 'Скрыть'
      btn.dataset.status = 'display';
      btn.classList.remove('btn--line--more');
      btn.classList.add('btn--line--less');
      block.style.height = 'auto';
    }
  }

  btns.forEach((btn) => {
    btn.addEventListener('click', function () {
      let items = moreItems[this.dataset.moreId].block;
      let btn = this;
      let action = (this.dataset.status === 'hidden' || this.dataset.status === undefined) ? 'display' : 'hide';
      toggleBlock(items, btn, action);
    })
  })
}
