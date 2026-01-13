/// <reference types="vite/client" />

import * as util from './lib/util.js';
import history_json from './config/history.js';
import product_json from './config/product.js';
import memories_json from './config/memories.js';
// Import styles
import '../scss/style.scss';
// Import FontAwesome
import './fontawesome.js';

const images = import.meta.glob('@images/**/*.{png,jpg,jpeg,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const imagesMap = Object.keys(images)
  .map((x) => {
    return x.replace('/assets/images', '@images');
  })
  .reduce((acc, cur, i) => {
    acc[cur] = images[Object.keys(images)[i]];
    return acc;
  }, {});

// Component classes
class HistoryBox {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.render();
  }

  render() {
    const html = `
      <div class=\"history-box\">
        ${this.data
          .map(
            (history) => `
              <section>
                <p class=\"version\">version_${history.version}</p>
                <h4 class=\"title\">${history.title}</h4>
                <img src=\"${imagesMap[history.thumb]}\" alt=\"${history.title}\" />
                <a href=\"${history.link}\" target=\"_blank\">查看v${history.version}</a>
              </section>`
          )
          .join('')}
      </div>
    `;
    this.container.innerHTML = html;
  }
}

class ProductBox {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.render();
  }

  render() {
    const renderSection = (/** @type {any[]} */ items, /** @type {string} */ title) => `
      <h3 class=\"sub-title\">${title}</h3>
      <section>
        ${items
          .map(
            (item) => `
              <a href=\"${item.link}\" target=\"_blank\">
                <img src=\"${imagesMap[item.thumb]}\" alt=\"${item.name}\" />
                <h4 class=\"name\">${item.name}</h4>
                <p class=\"description\">${item.description}</p>
                <small class=\"date\">${item.date}</small>
              </a>
              `
          )
          .join('')}
      </section>
    `;

    const html = `
      <div class=\"product-box\">
        ${renderSection(this.data.app, '应用程序·服务')}
        ${renderSection(this.data.works, '工作实绩')}
        ${renderSection(this.data.design, '设计作品')}
        ${renderSection(this.data.lib, '库文件')}
        ${renderSection(this.data.movie, '视频作品')}
      </div>
    `;
    this.container.innerHTML = html;
  }
}

class MemoriesBox {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.render();
  }

  render() {
    const html = `
      <div class=\"memories-box\">
        ${this.data
          .map(
            (memory) => `
              <a href=\"${memory.link}\" title=\"${memory.title}\" target=\"_blank\">
                <img src=\"${imagesMap[memory.thumb]}\" alt=\"${memory.title}\" />
                <h4 class=\"title\">${memory.title}</h4>
                <small class=\"date\">${memory.date}</small>
              </a>
            `
          )
          .join('')}
      </div>
    `;
    this.container.innerHTML = html;
  }
}

// Initialize app
const initApp = () => {
  util.setRingSize();
  util.bindNav();
  util.bindCloseBtn();

  // Initialize components
  const historyContainer = document.querySelector('history-box');
  const productContainer = document.querySelector('product-box');
  const memoriesContainer = document.querySelector('memories-box');

  if (historyContainer) new HistoryBox(historyContainer, history_json);
  if (productContainer) new ProductBox(productContainer, product_json);
  if (memoriesContainer) new MemoriesBox(memoriesContainer, memories_json);

  const preloadImages = Object.values(images);

  // Start loading sequence
  util.startLoading(() => {
    util.preload(
      preloadImages,
      () => {
        util.finLoad();
        util.showSkipButton();
      },
      (/** @type {{ per: number; }} */ data) => {
        console.log(`加载中: ${Math.round(data.per * 100)}%`);
      }
    );
  });
};

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
