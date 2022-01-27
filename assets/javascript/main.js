import { graphicalData } from "./graphicalData.js";
const htmlDoc = document.querySelector("HTML");
const currentLanguage = htmlDoc.lang;
(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
// Test via a getter in the options object to see if the passive property is accessed
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, "passive", {
    get: function () {
      supportsPassive = true;
    },
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

const menuBtn = document.querySelector(".js-mobile-button");
const header = document.querySelector(".js-header");
const navMenu = document.querySelector(".js-navMenu");
const navMenuList = document.querySelector(".js-navMenuList");
const separatorLogo = document.querySelector(".js-separtator-logo");
const mainSectionImage = document.querySelector(".js-main-section__image");
const htmlContainer = document.querySelector("html");
let scrollBefore = 0;
const filterCovering = document.querySelector(".js-filterCovering");
const filterBar = document.querySelector(".js-filterBar");
const buttonMenuMobile = document.querySelector(".js-buttonMenuMobile");
const buttonschartChange = document.querySelectorAll(".js-chart-change");
const elementTarget = document.getElementById("section-2");
const ctx = document.getElementById("myChart");
let myBar;

navMenuList.classList.remove("nav-menu__list--deactivate-animation");

const chartData = {
  labels: [],
  datasets: [
    {
      label: [],
      data: [],
      backgroundColor: "#003A6A",
      borderWidth: 0,
    },
  ],
};

const barOptions = {
  events: false,
  showTooltips: false,
  legend: {
    position: "bottom",
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      },
    ],
  },
  animation: {
    duration: 500,
    easing: "easeInSine",
    onComplete: function () {
      let fontSize = 13;
      if (document.body.clientWidth > 1024) {
        fontSize = 18;
      }
      let ctx = this.chart.ctx;
      ctx.font = Chart.helpers.fontString(
        fontSize,
        "bold",
        Chart.defaults.global.defaultFontFamily
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (let i = 0; i < this.data.datasets.length; i++) {
        const dataset = this.data.datasets[i];
        for (let e = 0; e < dataset.data.length; e++) {
          const model =
            dataset._meta[Object.keys(dataset._meta)[0]].data[e]._model;
          ctx.fillStyle = "#003A6A";
          ctx.fillText(
            Intl.NumberFormat("de-DE").format(dataset.data[e]),
            model.x,
            model.y - 5
          );
        }
      }
    },
  },
};

const menuBtnFn = () => {
  navMenuList.classList.toggle("nav-menu__list--show");
  navMenuList.classList.toggle("nav-menu__list--hide");
  header.classList.toggle("header--force-bg-white");
  navMenu.classList.toggle("nav-menu--force-white");
  separatorLogo.classList.toggle("separtator-logo--force");
};
menuBtn.addEventListener("click", menuBtnFn, false);
function onscroll() {
  const scrollPosition = htmlContainer.scrollTop;
  const mainSectionImageCoors = mainSectionImage.getBoundingClientRect();
  const headerHight = header.clientHeight;
  const controlHeightScroll = Math.abs(mainSectionImageCoors.top) + headerHight;
  const isAfterMainSection =
    controlHeightScroll >= mainSectionImageCoors.height;
  if (scrollPosition <= scrollBefore && isAfterMainSection) {
    separatorLogo.classList.add("separtator-logo--disappear");
    navMenuList.classList.add("nav-menu__list--hide");
    menuBtn.classList.add("mobile-button-menu--show");
    separatorLogo.classList.remove("separtator-logo--disappear");
  } else if (isAfterMainSection) {
    separatorLogo.classList.add("separtator-logo--disappear");
    navMenuList.classList.remove("nav-menu__list--hide");
    menuBtn.classList.remove("mobile-button-menu--show");
    navMenu.classList.add("nav-menu--white");
    navMenuList.classList.remove("nav-menu__list--white");
    separatorLogo.classList.remove("separtator-logo--white");
  } else if (scrollPosition <= scrollBefore && !isAfterMainSection) {
    menuBtn.classList.add("mobile-button-menu--show");
    navMenuList.classList.add("nav-menu__list--hide");
    navMenu.classList.remove("nav-menu--white");
    separatorLogo.classList.add("separtator-logo--white");
    if (separatorLogo.classList.contains("separtator-logo--disappear"))
      separatorLogo.classList.remove("separtator-logo--disappear");
  } else {
    menuBtn.classList.add("mobile-button-menu--show");
    navMenuList.classList.add("nav-menu__list--hide");
    navMenu.classList.remove("nav-menu--white");
    separatorLogo.classList.add("separtator-logo--white");
    separatorLogo.classList.add("separtator-logo--disappear");
  }

  scrollBefore = scrollPosition;
  if (
    ctx &&
    window.scrollY + window.innerHeight > ctx.offsetTop + ctx.offsetHeight &&
    !myBar
  ) {
    myBar = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: barOptions,
    });
    let buttonschartChangeActive;
    buttonschartChange.forEach((buttonchartChange, index) => {
      const chartChange = (event) => {
        if (event && event.type === "click") {
          event.preventDefault({ type: "none" });
        }
        if (buttonschartChangeActive === buttonchartChange) return;
        buttonschartChangeActive &&
          buttonschartChangeActive.classList.remove("icon__link--active");
        buttonchartChange.classList.add("icon__link--active");
        buttonschartChangeActive = buttonchartChange;
        const selectedGraphical = graphicalData[buttonchartChange.dataset.type];
        myBar.data.labels = selectedGraphical.labels;
        myBar.data.datasets.forEach((dataset, index) => {
          dataset.label =
            selectedGraphical.datasets[index].label[currentLanguage];
          dataset.data = selectedGraphical.datasets[index].data;
          delete myBar.options.scales.yAxes[0].ticks.max;
        });
        myBar.update();
        const ticks = myBar.boxes.find((box) => box.id === "y-axis-0").ticks;
        if (ticks.length < 2) return;
        const tickStep = parseFloat(ticks[0]) - parseFloat(ticks[1]);
        myBar.options.scales.yAxes[0].ticks.max =
          parseFloat(ticks[0]) + tickStep;
        myBar.update();
      };
      if (index === 0) {
        chartChange();
      }
      buttonchartChange.addEventListener("click", chartChange, false);
      buttonchartChange.addEventListener(
        "touchstart",
        chartChange,
        supportsPassive ? { passive: true } : false
      );
    });
  }
}
const throttled = _.throttle(onscroll, 60);
window.addEventListener("scroll", throttled);
onscroll();

function goToAnchor(event) {
  let anchorLink = event.target.getAttribute("href");
  event.preventDefault();
  let tmpTarget = event.target;
  if (!anchorLink) {
    do {
      tmpTarget = tmpTarget.parentNode;
    } while (!tmpTarget.getAttribute("href"));
    anchorLink = tmpTarget.getAttribute("href");
  }
  const anchor = document.querySelector(
    '[id="' + anchorLink.substring(1) + '"]'
  );
  if (anchor) {
    anchor.scrollIntoView({ behavior: "smooth" });
    navMenuList.classList.remove("nav-menu__list--show");
    buttonMenuMobile.classList.remove("menu-sections__button-menu--active");
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchorLink) => {
  anchorLink.addEventListener("click", goToAnchor, false);
  anchorLink.addEventListener("touchend", goToAnchor, false);
});
let swiper = new Array(
  document.querySelectorAll("[class*=js-swiper-container]").length
);
function controlClassSlider(selector, method) {
  const swiperContainer = document.querySelector(selector);
  const swiperWrapper = swiperContainer && swiperContainer.children[0];
  if (!swiperContainer || !swiperWrapper) return;
  swiperWrapper.classList[method]("swiper-wrapper");
  for (let i = 0; i < swiperWrapper.children.length; i++) {
    swiperWrapper.children[i].classList[method]("swiper-slide");
  }
  if (method === "add") {
    swiperContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="swiper-pagination"></div>`
    );
  } else {
    const swiperPagination =
      swiperContainer.querySelector(".swiper-pagination");
    swiperContainer.removeChild(swiperPagination);
  }
}
function ControlShowSlider() {
  const mQuery = window.matchMedia("(min-width: 768px)");
  if (mQuery.matches && swiper[0]) {
    for (let i = 0; i < swiper.length; i++) {
      if (
        swiper[i] &&
        swiper[i].eventsListeners &&
        Object.keys(swiper[i].eventsListeners).length !== 0
      ) {
        swiper[i].destroy();
      }
      swiper[i] = null;
      controlClassSlider(`.js-swiper-container-${i}`, "remove");
    }
  } else if (!mQuery.matches && !swiper[0]) {
    for (let i = 0; i < swiper.length; i++) {
      controlClassSlider(`.js-swiper-container-${i}`, "add");
      swiper[i] = new Swiper(`.js-swiper-container-${i}`, {
        autoHeight: false, //enable auto height
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    }
  }
}
ControlShowSlider();
const throttledControlShowSlider = _.throttle(ControlShowSlider, 60);
window.addEventListener("resize", throttledControlShowSlider);
function filteringCover(val) {
  const allItems = filterCovering.querySelectorAll("[data-covering]");
  const findRegExp = val && new RegExp(val, "i");
  allItems.forEach((item) => {
    if (val && !findRegExp.test(item.dataset.covering)) {
      item.classList.add("filter__item--hide");
      item.classList.remove("filter__item--show");
    } else {
      item.classList.remove("filter__item--hide");
      item.classList.add("filter__item--show");
    }
  });
  swiper[0] && swiper[0].update();
}

function findFilterButton(target) {
  let internalTarget = target;
  while (
    !(
      internalTarget &&
      internalTarget.classList &&
      internalTarget.classList.contains("filter-button")
    ) &&
    internalTarget
  ) {
    internalTarget = internalTarget.parentNode;
  }

  return internalTarget;
}

function AddFilter(event) {
  const item = findFilterButton(event.target);
  if (item) {
    const filter = item.dataset.filter;
    filteringCover(filter === "Reset" ? false : filter);
    activateStyleFilter(filter === "Reset" ? false : item);
  }
}

let showingInfoFilter = false;
function showInfoFilter(event) {
  const item = findFilterButton(event.target);
  if (item) {
    if (item.style.width) return;
    const filterButtonText = item.querySelector(".filter-button__text");
    if (filterButtonText) {
      item.style.width = "auto";
      const newWidth = filterButtonText.getBoundingClientRect().width;
      item.style.width = "";
      window.requestAnimationFrame(() => {
        item.style.width = `${newWidth}px`;
      });
    }
  }
}
function activateStyleFilter(item) {
  const activeClass = "filter-button--active";
  const actualFilter = filterBar.querySelector("." + activeClass);
  actualFilter && actualFilter.classList.remove(activeClass);
  if (item) item.classList.add(activeClass);
}

function hideInfoFilter(event) {
  const item = event.fromElement;
  if (item.style.width) item.style.width = "";
}
const throttledShowInfoFilter = _.throttle(showInfoFilter, 60);
const throttledHideInfoFilter = _.throttle(hideInfoFilter, 60);
filterBar.addEventListener("click", AddFilter, false);
filterBar.addEventListener(
  "touchstart",
  AddFilter,
  supportsPassive ? { passive: true } : false
);
filterBar.querySelectorAll(".filter-button").forEach((filterButton) => {
  filterButton.addEventListener("mouseover", throttledShowInfoFilter, false);
  filterButton.addEventListener("mouseleave", throttledHideInfoFilter, false);
});
buttonMenuMobile.addEventListener(
  "click",
  (e) => {
    buttonMenuMobile.classList.toggle("menu-sections__button-menu--active");
  },
  false
);
buttonMenuMobile.addEventListener(
  "blur",
  (e) => {
    buttonMenuMobile.classList.remove("menu-sections__button-menu--active");
  },
  false
);
