# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


Описание основных классов

1. EventEmitter (components/base/events.ts)

Назначение: диспетчер событий для обмена сообщениями между компонентами и моделями.
Ключевые методы:
- `on<T>(eventName, callback)`: подписаться на событие.
- `emit<T>(eventName, data?)`: сгенерировать событие с данными.
- `off(eventName, callback)`: отменить подписку.

2. Component<T> (components/base/Component.ts)

Назначение: базовый класс для UI-компонентов с абстракцией работы с DOM.
Ключевые методы:
- `toggleClass(element, className, force?)`: переключает CSS-класс.
- `setText(element, value)`: задаёт текстовое содержимое.
- `setDisabled(element, state)`: делает элемент неактивным/активным.
- `render(data?)`: отображает или обновляет компонент.

3. Model<T> (components/base/Model.ts)

Назначение: основа для моделей данных, отслеживает состояние и оповещает об изменениях.
Ключевые методы:
- `emitChanges(event, payload?)`: уведомляет об обновлении модели.

## Типы и интерфейсы

1. IProduct (types.ts)

Описание: структура для данных о товаре.
Поля:
- `id: string` — уникальный идентификатор
- `description: string` — описание товара
- `image: string` — URL изображения
- `title: string` — название
- `category: string` — категория
- `price: number | null` — цена в синтаксисе «синапсы» (возможно null)

2. IOrder (types.ts)

Описание: параметры заказа пользователя.
Поля:
- `email: string` — адрес электронной почты
- `phone: string` — номер телефона
- `address: string` — адрес доставки
- `payment: string` — метод оплаты ("card" или "cash")
- `total: number` — итоговая стоимость
- `items: string[]` — список ID товаров

3. IAppState (types.ts)

Описание: интерфейс состояния приложения и операций над данными.

Поля:
- `catalog: IProduct[]` — перечень товаров
- `basket: IProduct[]` — содержимое корзины
- `preview: IProduct | null` — выбранный товар для предпросмотра
- `order: IOrder | null` — текущие данные заказа

Методы (реализованы в AppState):
- `setCatalog(items: IProduct[]): void` — задать список товаров
- `setPreview(item: IProduct): void` — выбрать товар для просмотра
- `addToBasket(item: IProduct): void` — добавить в корзину
- `removeFromBasket(id: string): void` — удалить из корзины
- `clearBasket(): void` — очистить корзину
- `clearOrder(): void` — убрать данные заказа
- `clearAll(): void` — сбросить всё состояние
- `getTotalPrice(): number` — вычислить общую сумму
- `getBasketItems(): number` — посчитать количество товаров
- `selected(): void` — собрать ID товаров в заказ
- `prepareOrder(): IOrder` — сформировать заказ
- `validateOrder(): boolean` — проверить корректность заказа
- `validateContact(): boolean` — проверить контактные данные
- `setOrderInput(field: keyof OrderForm, value: string): void` — обновить поле формы

4. OrderForm (types.ts)

Описание: часть IOrder без полей total и items (Omit).
Поля:
- `email: string`
- `phone: string`
- `address: string`
- `payment: string`

5. FormError (types.ts)

Описание: структура для ошибок валидации формы.
Определение: Partial<Record<keyof OrderForm, string>>

6. IEvents (components/base/events.ts)

Описание: контракт для системы событий.
Методы:
- `on<T>(event, callback)`: подписка
- `emit<T>(event, data?)`: отправка события

7. IModalData (components/common/Modal.ts)

Описание: входные данные для модального окна.
Поля:
- `content: HTMLElement` — содержимое модального диалога

8. IBasketManager (components/BasketManager.ts)

Описание: интерфейс для работы с корзиной и кеширования элементов.
Методы:
- `updateBasket(items)`: обновить содержимое корзины
- `clearCache()`: очистить кеш

9. ApiListResponse<Type> (components/base/api.ts)

Описание: общий ответ от API при запросе списков.
Поля:
- `total: number` — общее число записей
- `items: Type[]` — массив элементов

## Архитектура проекта

Проект организован на три уровня ответственности:

1. Слой данных (Model)

Управляет состоянием и взаимодействием с сервером.

- AppState (components/AppData.ts): глобальное состояние (каталог, корзина, заказ, ошибки).
- ProductsApi (components/api/ProductsApi.ts): расширенное API магазина.

2. Слой отображения (View)

Предоставляет DOM-компоненты для интерфейса.

- Card, Basket, BasketItem, Modal, Page, Order, Contacts, Success, Form

3. Слой управления (Presenter)

Связывает Model и View, реализует логику приложения.

- App (components/App.ts)
- BasketManager (components/BasketManager.ts)

## События (utils/constants.ts - EVENT_TYPES)

- catalog:change
- card:select
- card:add
- basket:remove
- basket:open
- basket:change
- order:open
- order:submit
- contacts:submit
- order:errors:change
- contacts:errors:change
- form:input:change
- modal:open
- modal:close
- order:reset
- contacts:reset

## Константы (utils/constants.ts)

- EVENT_TYPES — набор имён событий.
- TEMPLATES — идентификаторы шаблонов.
- ERROR_MESSAGES — тексты ошибок.
- CATEGORY_COLOR_MAP — цвета для категорий.

## Поток данных

1. Пользователь взаимодействует с UI.
2. EventEmitter публикует события.
3. AppState обновляет данные.
4. View-компоненты реагируют и обновляют DOM.
```

