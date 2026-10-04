# КТ-2 + КТ-3 + КТ-4 - Интернет-магазин электроники

## Что где находится

- `src/shop.ts` - единый TypeScript-код с реализацией КТ-2 и КТ-3.
- `index.html` - интерфейс магазина и БЭМ-разметка КТ-4.
- `styles.css` - БЭМ-стили КТ-4.
- `dist/shop.js` - скомпилированный JavaScript для браузера.
- `assets/` - изображения товаров и иконки.

## КТ-2 — ООП

В `src/shop.ts` с подробными комментариями реализованы:
1. Инкапсуляция - `Product` с private-полями и методами доступа.
2. Наследование - `ElectronicProduct`, `Laptop`, `Smartphone`.
3. Полиморфизм - общий тип `Product`, переопределение `getInfo()`.
4. Композиция - `Order` содержит `OrderItem`.
5. Агрегация - `Store` хранит существующие `Order`.

## КТ-3 — SOLID

В `src/shop.ts` с комментариями реализированы:
- S - Single Responsibility;
- O - Open/Closed;
- L - Liskov Substitution;
- I - Interface Segregation;
- D - Dependency Inversion.

## КТ-4 — БЭМ

БЭМ реализован именно в HTML/CSS:
- блоки: `header`, `catalog`, `product-card`, `footer`;
- элементы: `header__logo`, `catalog__title`, `product-card__price` и т. д.;
- модификаторы: `header__nav-link--cart`, `product-card__favorite--active`, `product-card__button--primary`.


## Запуск

1. Открыть проект в VS Code.
2. Выполнить `npm run build`.
3. Открыть `index.html` в браузере.
