<!--
 @since 2025.04.16
 @changed 2025.08.05, 05:39
-->

# CHANGELOG

## [v.1.0.5](https://github.com/lilliputten/imodelist/releases/tag/v.1.0.5) - 2025.08.05

[Issue #7: Implement smart search panel](https://github.com/lilliputten/imodelist/issues/7):

- Fully implemented the static layout, styles and managing code (allowed to open/close the panel).
- Added loading spinner.
- Finished search panel logic, added throttled server data request, received data rendering, loading and waiting indicators.
- Updated webpack configuration: added babel transpilation for ES6+ syntax, all the js are minified and bundled into one file.

На https://imodelist.lilliputten.ru/ выложено в демо-режиме (см `const __isDev = ...` в `src/chunks/search-panel.js`): загружает файл из ``/assets/suggestion.json` и генерит (почти) рандомные данные (скриншоты следом); можно будет выкинуть после завершения интеграции.

Обновлены скрипты сборки: мой косяк был после предыдущих апдейтов -- js не минимизировался из-за используемого ES6. Сейчас командой `npm run build:bundle` всё оптимизируется и собирается в один бандл (`bundle-XXX.{js|css}`). Команда `npm run build` сделает много js файлов, как раньше (как сейчас, но обфусцированных).

### Внутри:

Показывается 3 первых результата из полученных (переменная maxDisplayingProducts).

Ввод данных троттлится с задержкой в 1000мс -- если в течение этого времени не было пользовательского ввода, отправляется запрос на сервер (переменная `acceptChangesDelay`).

Строка поиска инициализируется при открытии страницы из параметра q url query.

По кнопкам "Все результаты" и "Поиск" (вверху, с иконкой) — происходит сабмит оригинальной формы с текущей строкой поиска.

### Файлы:

Код JS: [src/chunks/search-panel.js](src/chunks/search-panel.js)

Стили панели поиска -- модуль [src/scss/elements/search-panel.scss](src/scss/elements/search-panel.scss).

### Layout

Вёрстка панели в шаблоне [src/templates/modules/search-panel.ejs](src/templates/modules/search-panel.ejs) (включается в [src/templates/modules/preheader.ejs](src/templates/modules/preheader.ejs)). Остальная разметка не менялась.

### API

API method url: ``/search/suggestion/?q={SEARCH_TEXT}``. См. переменнаую `apiPathPrefix`.

Expected response data format:

```javascript
  /**
   * @typedef {Object} ProductsItem
   * @property {string|number} id - Product id or art.no
   * @property {string} value - Product title
   * @property {string} text - Product short name (whatever it is)
   * @property {number|string} price - Price, eg '1 300' (space delimited)
   * @property {string} [units] - Currency, optional, default is "р." (Russian rubles)
   * @property {number|string} [oldPrice] - Old price, the same as `price`, optional
   * @property {string} url - Url in the catalogue
   * @property {string} imgUrl - Image url
   */

  /** Sample product item data
   * @type {ProductsItem}
   */
  const sampleProduct = {
    id: 70063,
    value: '70063 Акан Краска...',
    text: '70063',
    price: '1 200',
    oldPrice: '1 650',
    url: '/goods/klei/akan/123/110/38247.html',
    imgUrl: '/file/i/207/207/769436ae/bdb355b865c7d64c38322a06dd7221d6.jpg',
  };
```

See also:

- [Compare with the previous version](https://github.com/lilliputten/imodelist/compare/v.1.0.4...v.1.0.5)
- [Donwload published build](https://github.com/lilliputten/imodelist/archive/refs/tags/publish.1.0.5.zip)

## [v.1.0.4](https://github.com/lilliputten/imodelist/releases/tag/v.1.0.3) - 2025.04.16

[Issue #5: Add personal data and cookies announcement](https://github.com/lilliputten/imodelist/issues/5):

- Added bottom notification panel with a private data usage warning.

See also:

- [Compare with the previous version](https://github.com/lilliputten/imodelist/compare/v.1.0.3...v.1.0.4)
- [Donwload published build](https://github.com/lilliputten/imodelist/archive/refs/tags/publish.1.0.4.zip)

## [v.1.0.3](https://github.com/lilliputten/imodelist/releases/tag/v.1.0.3) - 2025.03.25

[Issue #3: Update social icons](https://github.com/lilliputten/imodelist/issues/3):

- Added new icon skeletons (for tg, dzen, rutube; the last 2 ones are non-implemented yet).

See also:

- [Compare with the previous version](https://github.com/lilliputten/imodelist/compare/v.1.0.2...v.1.0.3)
- [Donwload published build](https://github.com/lilliputten/imodelist/archive/refs/tags/publish.1.0.3.zip)

