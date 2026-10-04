"use strict";

// кт2
// инкапсуляция
// инкапсуляция реализована в классе Product
// данные товара хранятся внутри объекта
// для работы с данными используются методы класса
// например, остаток товара нельзя менять через отдельную функцию
// для изменения количества используется метод setStock()
// в этом методе дополнительно проверяется корректность значения

class Product {
    constructor(id, name, price, stock, brand = "Generic") {
        this.id = id;
        this.name = name;
        this.price = price;
        this.brand = brand;
        this.stock = stock;
    }

    // получение id товара
    getId() {
        return this.id;
    }

    // получение названия товара
    getName() {
        return this.name;
    }

    // получение цены товара
    getPrice() {
        return this.price;
    }

    // получение количества товара на складе
    getStock() {
        return this.stock;
    }

    // изменение количества товара
    // здесь реализована проверка данных
    // отрицательное количество товара установить нельзя
    setStock(quantity) {
        if (quantity < 0) {
            throw new Error("Количество товара не может быть отрицательным");
        }

        this.stock = quantity;
    }

    // проверка наличия нужного количества товара
    isAvailable(quantity) {
        return quantity > 0 && this.stock >= quantity;
    }

    // получение информации о товаре
    getInfo() {
        return `${this.name} — ${this.price} руб.`;
    }
}


// наследование
// класс ElectronicProduct наследуется от Product
// поэтому он получает все свойства и методы Product
// дальше Laptop и Smartphone наследуются от ElectronicProduct
// общие свойства не приходится писать заново в каждом классе

class ElectronicProduct extends Product {
    constructor(id, name, price, stock, brand, warranty) {
        // super() вызывает конструктор родительского класса Product
        super(id, name, price, stock, brand);

        this.warranty = warranty;
    }

    getWarranty() {
        return this.warranty;
    }

    getBrand() {
        return this.brand;
    }
}

// Laptop является наследником ElectronicProduct
// он получает id, name, price, stock, brand и warranty
// дополнительно у ноутбука появляются ram и storage

class Laptop extends ElectronicProduct {
    constructor(id, name, price, stock, brand, warranty, ram, storage) {
        super(id, name, price, stock, brand, warranty);

        this.ram = ram;
        this.storage = storage;
    }

    getSpecs() {
        return `${this.ram} GB RAM, ${this.storage} GB SSD`;
    }
}


// Smartphone также наследуется от ElectronicProduct
// в отличие от Laptop он хранит количество мегапикселей камеры

class Smartphone extends ElectronicProduct {
    constructor(id, name, price, stock, brand, warranty, cameraMp) {
        super(id, name, price, stock, brand, warranty);

        this.cameraMp = cameraMp;
    }

    getCamera() {
        return `${this.cameraMp} MP camera`;
    }
}



// полиморфизм
// полиморфизм позволяет работать с разными объектами через общий
// интерфейс базового класса
// DiscountedProduct наследуется от Product
// но по-своему реализует метод getInfo()
// обычный Product возвращает обычную цену
// DiscountedProduct возвращает цену уже с учётом скидки
// при этом функция printProductInfo() не знает, какой именно объект ей передали


class DiscountedProduct extends Product {
    constructor(id, name, price, stock, brand, discountPercent) {
        super(id, name, price, stock, brand);

        this.discountPercent = discountPercent;
    }

    getFinalPrice() {
        return this.getPrice() * (1 - this.discountPercent / 100);
    }

    // переопределение метода родительского класса
    // это пример полиморфизма
    getInfo() {
        return `${this.getName()} — ${this.getFinalPrice()} руб. со скидкой`;
    }
}

// композиция
// Order состоит из объектов OrderItem
// OrderItem является частью конкретного заказа
// если создаётся заказ, его позиции создаются внутри заказа
// поэтому Order владеет своей коллекцией OrderItem

class OrderItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    getSubtotal() {
        return this.product.getPrice() * this.quantity;
    }
}


class Order {
    constructor() {
        // здесь Order создаёт собственную коллекцию позиций
        // это реализация композиции
        this.items = [];

        this.status = "новый";
        this.createdAt = new Date();
    }

    addItem(product, quantity) {
        // перед добавлением проверяем наличие товара
        if (!product.isAvailable(quantity)) {
            throw new Error(`Недостаточно товара: ${product.getName()}`);
        }

        // Order создаёт объект OrderItem
        const item = new OrderItem(product, quantity);

        this.items.push(item);

        // уменьшаем количество товара на складе
        product.setStock(product.getStock() - quantity);
    }

    getTotal() {
        return this.items.reduce(
            (total, item) => total + item.getSubtotal(),
            0
        );
    }

    deliver() {
        this.status = "доставлен";
    }

    canReturn(days) {
        return this.status === "доставлен" && days <= 14;
    }

    getRestockingFee() {
        return this.getTotal() * 0.1;
    }

    getCreatedAt() {
        return this.createdAt;
    }
}


// агрегация
// Store хранит уже существующие объекты Order
// заказ может существовать отдельно от Store
// Store не создаёт Order внутри себя
// он только получает готовый объект через addOrder()
// поэтому здесь используется агрегация

class Store {
    constructor() {
        this.orders = [];
    }

    // сюда передаётся уже созданный заказ
    addOrder(order) {
        this.orders.push(order);
    }

    getOrders() {
        return [...this.orders];
    }
}


// кт3 ПРИНЦИПЫ SOLID
// S — SINGLE RESPONSIBILITY PRINCIPLE
// ПРИНЦИП ЕДИНОЙ ОТВЕТСТВЕННОСТИ
// каждый класс выполняет одну отдельную задачу
// OrderCalculator отвечает только за расчёт суммы
// OrderRepository отвечает за сохранение заказа
// EmailNotifier отвечает за отправку уведомления
// ReceiptPrinter отвечает за печать чека
// обязанности не смешиваются в одном классе

class OrderCalculator {
    // только расчёт стоимости
    calculateTotal(items) {
        return items.reduce((sum, item) => sum + item.price, 0);
    }
}


// отвечает только за сохранение заказа
class OrderRepository {
    save(orderId) {
        console.log(`Заказ ${orderId} сохранён`);
    }
}


// отвечает только за отправку email
class EmailNotifier {
    send(email, message) {
        console.log(`Email отправлен на ${email}: ${message}`);
    }
}


// отвечает только за печать чека
class ReceiptPrinter {
    print(orderId, total) {
        console.log(`Чек для заказа ${orderId}: ${total} руб.`);
    }
}


// O — OPEN/CLOSED PRINCIPLE
// ПРИНЦИП ОТКРЫТОСТИ/ЗАКРЫТОСТИ
// классы должны быть открыты для расширения,
// но закрыты для изменения
// в проекте есть разные способы оплаты
// CardPayment, CashPayment и CryptoPayment
// CheckoutService не нужно изменять при добавлении нового способа
// оплаты
// можно создать новый класс, например PayPalPayment,
// с методом pay() и передать его в CheckoutService
// существующий CheckoutService при этом останется без изменений

class CardPayment {
    pay(amount) {
        console.log(`Оплата картой: ${amount} руб.`);
        return true;
    }
}


class CashPayment {
    pay(amount) {
        console.log(`Оплата наличными: ${amount} руб.`);
        return true;
    }
}


class CryptoPayment {
    pay(amount) {
        console.log(`Оплата криптовалютой: ${amount} руб.`);
        return true;
    }
}


// сервис не зависит от конкретного способа оплаты
// он работает с любым объектом, у которого есть метод pay()
class CheckoutService {
    processPayment(payment, amount) {
        return payment.pay(amount);
    }
}


// L — LISKOV SUBSTITUTION PRINCIPLE
// ПРИНЦИП ПОДСТАНОВКИ ЛИСКОВ
// объекты дочерних классов должны нормально работать там, где ожидается объект родительского класса
// DiscountedProduct является наследником Product
// поэтому его можно передать в функцию printProductInfo()
// вместо обычного Product
// функция продолжает работать без изменений

function printProductInfo(product) {
    console.log(product.getInfo());
}


// ещё один пример работы с заказами
// SimpleOrder и FullOrder имеют метод calculateTotal()
// при работе с объектами заказа код может использовать общий контракт

class SimpleOrder {
    constructor() {
        this.items = [];
    }

    addItem(price) {
        this.items.push({ price });
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}


class FullOrder {
    constructor(id, total = 0) {
        this.id = id;
        this.total = total;
    }

    calculateTotal() {
        return this.total;
    }

    setTotal(total) {
        this.total = total;
    }

    save() {
        console.log(`Заказ ${this.id} сохранён`);
    }

    print() {
        console.log(`Чек заказа ${this.id}`);
    }
}


// I — INTERFACE SEGREGATION PRINCIPLE
// ПРИНЦИП РАЗДЕЛЕНИЯ ИНТЕРФЕЙСОВ
// классы не должны зависеть от методов, которые им не нужны
// в данном проекте операции разделены по назначению
// например, хранилищу нужен только метод save()
// ему не нужны методы печати чека, оплаты или отправки email
// поэтому разные хранилища реализуют только необходимую операцию save()

class FileStorage {
    // классу нужен только метод сохранения
    save(data) {
        console.log(`Файл: ${data}`);
    }
}


class DatabaseStorage {
    // классу нужен только метод сохранения
    save(data) {
        console.log(`БД: ${data}`);
    }
}


class CloudStorage {
    // классу нужен только метод сохранения
    save(data) {
        console.log(`Облако: ${data}`);
    }
}


// D — DEPENDENCY INVERSION PRINCIPLE
// ПРИНЦИП ИНВЕРСИИ ЗАВИСИМОСТЕЙ
// AnalyticsService не создаёт внутри себя конкретный DatabaseStorage
// вместо этого хранилище передаётся через конструктор
// поэтому AnalyticsService зависит не от конкретной реализации,
// а от объекта, который умеет выполнять save()
// можно передать DatabaseStorage, FileStorage или CloudStorage

class AnalyticsService {
    constructor(storage) {
        // зависимость передаётся извне
        this.storage = storage;
    }

    saveReport(report) {
        this.storage.save(report);
    }
}


// ПРИМЕР ИСПОЛЬЗОВАНИЯ КЛАССОВ
// создаём ноутбук
// используется класс Laptop, который наследуется от Product
const laptop = new Laptop(
    "L01",
    "MacBook Pro",
    1999,
    5,
    "Apple",
    24,
    18,
    512
);


// создаём смартфон
// используется наследование Smartphone -> ElectronicProduct -> Product
const phone = new Smartphone(
    "P01",
    "iPhone 15 Pro",
    1099,
    10,
    "Apple",
    12,
    48
);


// создаём товар со скидкой
// используется полиморфизм
const discountedPhone = new DiscountedProduct(
    "P02",
    "iPhone 14",
    899,
    8,
    "Apple",
    10
);


// создаём заказ
const order = new Order();


// добавляем товары в заказ
// внутри Order создаются объекты OrderItem
// это пример композиции
order.addItem(laptop, 1);
order.addItem(phone, 1);


// меняем статус заказа
order.deliver();


// создаём магазин
const store = new Store();


// добавляем уже существующий заказ в магазин
// это пример агрегации
store.addOrder(order);


// ПОЛИМОРФИЗМ
// одна и та же функция работает с разными объектами
// laptop использует getInfo() из Product
// discountedPhone использует переопределённый getInfo()
// из DiscountedProduct
printProductInfo(laptop);
printProductInfo(discountedPhone);


// S
// используем отдельный класс только для расчёта
const calculator = new OrderCalculator();


// O
// CheckoutService работает с разными способами оплаты
const checkout = new CheckoutService();


// отдельные классы отвечают за свои задачи
const repository = new OrderRepository();
const notifier = new EmailNotifier();
const printer = new ReceiptPrinter();


// рассчитываем общую стоимость
const total = calculator.calculateTotal([
    {
        price: laptop.getPrice()
    },
    {
        price: phone.getPrice()
    }
]);


// передаём способ оплаты отдельно
// CheckoutService не знает конкретный класс оплаты
checkout.processPayment(new CardPayment(), total);


// сохраняем заказ
repository.save("ORD-001");


// отправляем уведомление
notifier.send(
    "customer@example.com",
    "Ваш заказ подтверждён"
);


// печатаем чек
printer.print("ORD-001", total);


// D
// AnalyticsService получает конкретное хранилище извне
// сейчас передаём DatabaseStorage
// но вместо него можно использовать FileStorage или CloudStorage
const analytics = new AnalyticsService(
    new DatabaseStorage()
);

analytics.saveReport(
    `Выручка: ${order.getTotal()} руб.`
);


// кт4 БЭМ
// БЭМ используется при создании карточек товаров
// структура:
// product-card — блок
// product-card__image-wrapper — элемент блока
// product-card__image — элемент блока
// product-card__favorite — элемент блока
// product-card__info — элемент блока
// product-card__title — элемент блока
// product-card__price — элемент блока
// product-card__button — элемент блока
// product-card__favorite--active — модификатор
// product-card__button--primary — модификатор
// таким образом в проекте используются:
// блоки
// элементы
// модификаторы

const catalogProducts = [
    {
        id: "1",
        name: "Apple iPhone 15 Pro 256ГБ Черный",
        price: 1099,
        image: "assets/1.jpg"
    },
    {
        id: "2",
        name: "Samsung Galaxy S24 Ultra 512ГБ Титан",
        price: 1299,
        image: "assets/2.jpg"
    },
    {
        id: "3",
        name: "Xiaomi 14 Pro 256ГБ Зеленый",
        price: 899,
        image: "assets/3.jpg"
    },
    {
        id: "4",
        name: "Apple MacBook Pro 14 M3 Pro 512ГБ Серый",
        price: 1999,
        image: "assets/4.jpg"
    },
    {
        id: "5",
        name: "Apple iPad Air 11 256GB Wi-Fi Синий",
        price: 749,
        image: "assets/5.jpg"
    },
    {
        id: "6",
        name: "Apple Watch Series 9 GPS 45mm Розовый",
        price: 399,
        image: "assets/6.jpg"
    }
];


// КТ-4. БЭМ
// здесь создаётся HTML карточки товара
// product-card — основной блок карточки
// product-card__image-wrapper — элемент для изображения
// product-card__image — изображение
// product-card__favorite — кнопка избранного
// product-card__info — информационная часть
// product-card__title — название
// product-card__price — цена
// product-card__button — кнопка
// модификаторы:
// product-card__favorite--active
// product-card__button--primary
// модификаторы изменяют состояние или внешний вид элемента
function renderCatalog(products) {
    const catalog = document.querySelector(".catalog__grid");

    if (!catalog) return;

    catalog.innerHTML = products.map((product, index) => `
        
        <!-- кт4: блок product-card -->
        <article class="product-card">

            <!-- кт4: элемент блока для изображения -->
            <div class="product-card__image-wrapper">

                <!-- кт4: элемент блока изображение -->
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-card__image"
                >

                <!-- 
                    кт4: элемент блока product-card__favorite
                    модификатор --active показывает активное состояние
                -->
                <button
                    class="product-card__favorite${index === 1
                        ? " product-card__favorite--active"
                        : ""}"
                    aria-label="Добавить в избранное"
                >
                    <img
                        src="assets/${index === 1
                            ? "heart-filled"
                            : "heart-outline"}.png"
                        alt=""
                    >
                </button>
            </div>


            <!-- кт4: элемент блока с информацией -->
            <div class="product-card__info">

                <!-- кт4: элемент блока с названием -->
                <h3 class="product-card__title">
                    ${product.name}
                </h3>


                <!-- кт4: элемент блока с ценой -->
                <p class="product-card__price">
                    $${product.price.toLocaleString("en-US")}
                </p>


                <!-- 
                    кт4: элемент блока кнопка
                    --primary является модификатором кнопки
                -->
                <button
                    class="product-card__button product-card__button--primary"
                >
                    Добавить в корзину
                </button>

            </div>
        </article>
    `).join("");
}


// выводим каталог
renderCatalog(catalogProducts);

// БЭМ + JavaScript
// здесь используются те же БЭМ-классы для поиска элементов
// product-card__favorite — элемент блока
// product-card__button — элемент блока
// product-card__favorite--active — модификатор
// JavaScript меняет состояние элемента через модификатор
document.addEventListener("click", (event) => {
    const target = event.target;

    // кт4: поиск элемента блока по БЭМ-классу
    const favoriteButton = target.closest(
        ".product-card__favorite"
    );

    // кт4: поиск элемента кнопки по БЭМ-классу
    const cartButton = target.closest(
        ".product-card__button"
    );

    const cartCount = document.querySelector(
        ".header__cart-count"
    );

    // МОДИФИКАТОР БЭМ
    // при нажатии на избранное переключается модификатор
    // product-card__favorite--active
    // класс блока при этом не изменяется
    if (favoriteButton) {
        const active = favoriteButton.classList.toggle(
            "product-card__favorite--active"
        );

        const icon = favoriteButton.querySelector("img");

        if (icon) {
            icon.src = active
                ? "assets/heart-filled.png"
                : "assets/heart-outline.png";
        }
    }


    // работа с кнопкой карточки через её БЭМ-класс
    if (cartButton && cartCount) {
        cartCount.textContent = String(
            Number(cartCount.textContent || "0") + 1
        );
    }
});