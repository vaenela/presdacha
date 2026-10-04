
// кт2 ооп инкапсуляция наследование полиморфизм
// композиция и агрегация
// кт3 solid принципы solid
// кт4 bem методология используется в html и css
// кт2 пункт 1 инкапсуляция
// данные товара скрыты через private поля
// доступ к данным идёт через методы класса
class Product {
    private stock: number;

    constructor(
        private id: string,
        private name: string,
        private price: number,
        stock: number,
        protected brand: string = "Generic"
    ) {
        this.stock = stock;
    }

    getId(): string { return this.id; }
    getName(): string { return this.name; }
    getPrice(): number { return this.price; }
    getStock(): number { return this.stock; }

    // проверка не позволяет поставить отрицательный остаток
    setStock(quantity: number): void {
        if (quantity < 0) {
            throw new Error("Количество товара не может быть отрицательным");
        }
        this.stock = quantity;
    }

    isAvailable(quantity: number): boolean {
        return quantity > 0 && this.stock >= quantity;
    }

    getInfo(): string {
        return `${this.name} — ${this.price} руб.`;
    }
}
// наследование
// electronicproduct наследует product а laptop и smartphone
// наследуют electronicproduct поэтому общие поля не приходится писать заново
class ElectronicProduct extends Product {
    constructor(
        id: string,
        name: string,
        price: number,
        stock: number,
        brand: string,
        private warranty: number
    ) {
        super(id, name, price, stock, brand);
    }

    getWarranty(): number { return this.warranty; }
    getBrand(): string { return this.brand; }
}

class Laptop extends ElectronicProduct {
    constructor(
        id: string,
        name: string,
        price: number,
        stock: number,
        brand: string,
        warranty: number,
        private ram: number,
        private storage: number
    ) {
        super(id, name, price, stock, brand, warranty);
    }

    getSpecs(): string {
        return `${this.ram} GB RAM, ${this.storage} GB SSD`;
    }
}

class Smartphone extends ElectronicProduct {
    constructor(
        id: string,
        name: string,
        price: number,
        stock: number,
        brand: string,
        warranty: number,
        private cameraMp: number
    ) {
        super(id, name, price, stock, brand, warranty);
    }

    getCamera(): string {
        return `${this.cameraMp} MP camera`;
    }
}
// полиморфизм
// разные товары можно использовать через общий тип product
// getinfo можно переопределить в дочернем классе
// остальной код работает с product и не зависит от конкретного класса
class DiscountedProduct extends Product {
    constructor(
        id: string,
        name: string,
        price: number,
        stock: number,
        brand: string,
        private discountPercent: number
    ) {
        super(id, name, price, stock, brand);
    }

    getFinalPrice(): number {
        return this.getPrice() * (1 - this.discountPercent / 100);
    }

    override getInfo(): string {
        return `${this.getName()} — ${this.getFinalPrice()} руб. со скидкой`;
    }
}

interface Returnable {
    canReturn(days: number): boolean;
    getRestockingFee(): number;
}

class OrderItem {
    // композиция orderitem используется как часть конкретного заказа
    constructor(private product: Product, private quantity: number) {}

    getSubtotal(): number {
        return this.product.getPrice() * this.quantity;
    }
}

class Order implements Returnable {
    // композиция order хранит свои orderitem
    private items: OrderItem[] = [];
    private status: "новый" | "доставлен" = "новый";
    private createdAt: Date = new Date();

    addItem(product: Product, quantity: number): void {
        if (!product.isAvailable(quantity)) {
            throw new Error(`Недостаточно товара: ${product.getName()}`);
        }

        const item = new OrderItem(product, quantity);
        this.items.push(item);
        product.setStock(product.getStock() - quantity);
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    deliver(): void {
        this.status = "доставлен";
    }

    canReturn(days: number): boolean {
        return this.status === "доставлен" && days <= 14;
    }

    getRestockingFee(): number {
        return this.getTotal() * 0.1;
    }

    getCreatedAt(): Date { return this.createdAt; }
}

class Store {
    // агрегация store хранит уже созданные заказы
    private orders: Order[] = [];

    addOrder(order: Order): void {
        this.orders.push(order);
    }

    getOrders(): Order[] {
        return [...this.orders];
    }
}

// кт3
// принцип s одна ответственность
// каждый класс здесь отвечает за свою отдельную задачу
class OrderCalculator {
    calculateTotal(items: { price: number }[]): number {
        return items.reduce((sum, item) => sum + item.price, 0);
    }
}

class OrderRepository {
    save(orderId: string): void {
        console.log(`Заказ ${orderId} сохранён`);
    }
}

class EmailNotifier {
    send(email: string, message: string): void {
        console.log(`Email отправлен на ${email}: ${message}`);
    }
}

class ReceiptPrinter {
    print(orderId: string, total: number): void {
        console.log(`Чек для заказа ${orderId}: ${total} руб.`);
    }
}
// принцип o открытость для расширения и закрытость для изменения
// checkoutservice не нужно менять при добавлении нового способа оплаты
// достаточно сделать новый класс с интерфейсом paymentmethod
interface PaymentMethod {
    pay(amount: number): boolean;
}

class CardPayment implements PaymentMethod {
    pay(amount: number): boolean {
        console.log(`Оплата картой: ${amount} руб.`);
        return true;
    }
}

class CashPayment implements PaymentMethod {
    pay(amount: number): boolean {
        console.log(`Оплата наличными: ${amount} руб.`);
        return true;
    }
}

class CryptoPayment implements PaymentMethod {
    pay(amount: number): boolean {
        console.log(`Оплата криптовалютой: ${amount} руб.`);
        return true;
    }
}

class CheckoutService {
    processPayment(payment: PaymentMethod, amount: number): boolean {
        return payment.pay(amount);
    }
}
// l подстановка объектов
// discountedproduct можно передать туда где ожидается product
// метод getinfo остаётся доступным и замена объекта не ломает код
// поэтому printproductinfo работает и с дочерним классом
function printProductInfo(product: Product): void {
    console.log(product.getInfo());
}
// i разделение интерфейсов
// интерфейсы разделены по отдельным небольшим задачам
// simpleorder реализует только calculateTotal потому что остальные методы ему не нужны
interface ICalculatable {
    calculateTotal(): number;
}

interface ISavable {
    save(): void;
}

interface IPrintable {
    print(): void;
}

class SimpleOrder implements ICalculatable {
    private items: { price: number }[] = [];

    addItem(price: number): void {
        this.items.push({ price });
    }

    calculateTotal(): number {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}

class FullOrder implements ICalculatable, ISavable, IPrintable {
    constructor(private id: string, private total: number = 0) {}

    calculateTotal(): number { return this.total; }
    setTotal(total: number): void { this.total = total; }
    save(): void { console.log(`Заказ ${this.id} сохранён`); }
    print(): void { console.log(`Чек заказа ${this.id}`); }
}
// d зависимость от абстракции
// analyticsservice зависит от интерфейса ianalyticsstorage
// поэтому вместо конкретного хранилища можно передать любую подходящую реализацию
interface IAnalyticsStorage {
    save(data: string): void;
}

class FileStorage implements IAnalyticsStorage {
    save(data: string): void { console.log(`Файл: ${data}`); }
}

class DatabaseStorage implements IAnalyticsStorage {
    save(data: string): void { console.log(`БД: ${data}`); }
}

class CloudStorage implements IAnalyticsStorage {
    save(data: string): void { console.log(`Облако: ${data}`); }
}

class AnalyticsService {
    constructor(private storage: IAnalyticsStorage) {}

    saveReport(report: string): void {
        this.storage.save(report);
    }
}
// ниже пример использования кт2 и кт3 вместе
const laptop = new Laptop("L01", "MacBook Pro", 1999, 5, "Apple", 24, 18, 512);
const phone = new Smartphone("P01", "iPhone 15 Pro", 1099, 10, "Apple", 12, 48);
const discountedPhone = new DiscountedProduct("P02", "iPhone 14", 899, 8, "Apple", 10);

const order = new Order();
order.addItem(laptop, 1);
order.addItem(phone, 1);
order.deliver();

const store = new Store();
store.addOrder(order);

// кт2 полиморфизм один тип product работает с разными товарами
printProductInfo(laptop);
printProductInfo(discountedPhone);

const calculator = new OrderCalculator();
const checkout = new CheckoutService();
const repository = new OrderRepository();
const notifier = new EmailNotifier();
const printer = new ReceiptPrinter();

const total = calculator.calculateTotal([
    { price: laptop.getPrice() },
    { price: phone.getPrice() }
]);

checkout.processPayment(new CardPayment(), total);
repository.save("ORD-001");
notifier.send("customer@example.com", "Ваш заказ подтверждён");
printer.print("ORD-001", total);

const analytics = new AnalyticsService(new DatabaseStorage());
analytics.saveReport(`Выручка: ${order.getTotal()} руб.`);
// кт4 bem
// bem используется в html и css части проекта
// здесь используются блоки элементы и модификаторы вида block__element--modifier
// основная bem разметка находится в html и css
type CatalogProduct = {
    id: string;
    name: string;
    price: number;
    image: string;
};

const catalogProducts: CatalogProduct[] = [
    { id: "1", name: "Apple iPhone 15 Pro 256ГБ Черный", price: 1099, image: "assets/1.jpg" },
    { id: "2", name: "Samsung Galaxy S24 Ultra 512ГБ Титан", price: 1299, image: "assets/2.jpg" },
    { id: "3", name: "Xiaomi 14 Pro 256ГБ Зеленый", price: 899, image: "assets/3.jpg" },
    { id: "4", name: "Apple MacBook Pro 14 M3 Pro 512ГБ Серый", price: 1999, image: "assets/4.jpg" },
    { id: "5", name: "Apple iPad Air 11 256GB Wi-Fi Синий", price: 749, image: "assets/5.jpg" },
    { id: "6", name: "Apple Watch Series 9 GPS 45mm Розовый", price: 399, image: "assets/6.jpg" }
];

function renderCatalog(products: CatalogProduct[]): void {
    const catalog = document.querySelector<HTMLElement>(".catalog__grid");
    if (!catalog) return;

    catalog.innerHTML = products.map((product, index) => `
        <!-- КТ-4 БЭМ: блок product-card + его элементы product-card__image-wrapper,
             product-card__image, product-card__info, product-card__title,
             product-card__price, product-card__button. -->
        <article class="product-card">
            <div class="product-card__image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-card__image">
                <button class="product-card__favorite${index === 1 ? " product-card__favorite--active" : ""}" aria-label="Добавить в избранное">
                    <img src="assets/${index === 1 ? "heart-filled" : "heart-outline"}.png" alt="">
                </button>
            </div>
            <div class="product-card__info">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__price">$${product.price.toLocaleString("en-US")}</p>
                <button class="product-card__button product-card__button--primary">Добавить в корзину</button>
            </div>
        </article>
    `).join("");
}

renderCatalog(catalogProducts);

// кт4 интерактивность каталога счётчик корзины и переключение избранного
document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const favoriteButton = target.closest<HTMLButtonElement>(".product-card__favorite");
    const cartButton = target.closest<HTMLButtonElement>(".product-card__button");
    const cartCount = document.querySelector<HTMLElement>(".header__cart-count");

    if (favoriteButton) {
        const active = favoriteButton.classList.toggle("product-card__favorite--active");
        const icon = favoriteButton.querySelector<HTMLImageElement>("img");
        if (icon) {
            icon.src = active ? "assets/heart-filled.png" : "assets/heart-outline.png";
        }
    }

    if (cartButton && cartCount) {
        cartCount.textContent = String(Number(cartCount.textContent || "0") + 1);
    }
});