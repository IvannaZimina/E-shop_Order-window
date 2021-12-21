const orderFormElem = document.querySelector('.orderForm');               // главный div
const bodyOfTableElem = document.querySelector('.bodyOfTable');           // элементу, куда добавить строку заказа
const anotherOrderElem = document.querySelector('.anotherOrder');         // элемент - ссылка для формирования другого заказа
const totalAmountElem = document.querySelector('.totalAmount');           // элемент общей суммы заказа
const itemDatasCard = document.querySelectorAll('.itemDatasCard');        // элемент с атрибутами карточки позиции

const makeOrderBtn = document.querySelector('.makeOrder');                // кнопка открыть окно заказа - make order
const closedFormWindowBtn = document.querySelector('.closedFormWindow');  // кнопка закрыть окно заказа - Х
const sendFormWindowBtn = document.querySelector('.sendFormWindow');      // кнопка отправить заказ - send order
const addToBucketBtn = document.querySelectorAll('.addToBucket');         // кнопка добавить товар в корзину

makeOrderBtn.addEventListener('click', (ev) => {           // событие открыть окно заказа
    orderFormElem.classList.remove('closed');
});

closedFormWindowBtn.addEventListener('click', (ev) => {    // событие закрыть окно заказа
    orderFormElem.classList.add('closed');
})

const EE = function() {                 // то, что работает, но не понятно что там написано
    const list = {};
    this.on = (eventName, cb) => {
        if(!list[eventName]) {
            list[eventName] = [];
        }
        list[eventName].push(cb)
    }
    this.emit = (eventName, data) => {
        if(!list[eventName]) {
            return;
        }
        list[eventName].forEach(cb => {
            cb(data);
        });
    }
}

const cardEmit = new EE();              // конструктор создания событий, наверное
cardEmit.on('change', () => {           // on вместо addEventListener
    console.log('change');
})

const saveCardsToStore = (data) => {    // добавление карты товара или [товаров] в localStorage
    const json = JSON.stringify(data);
    localStorage.setItem('card', json);
};

const getCartInStore = () => {          // получение карты товара или [товаров] в localStorage
    const json = localStorage.getItem('card');
    if(!json) {
        return [];
    }
    const data = JSON.parse(json);
    return data;
};

const getProducts = async () => {       // запрос БД с сервера + вывод на сайт
    const { data } = await axios.get('/server');
    return data;
};

const addToBucket = (data) => {         // добавить товар с последующим увеличение кол-ва товара по кнопке ADD to bucket
    const bucket = getCartInStore();                        // достаем данные из localStorage
    const { id } = data;

    const itemIdx = bucket.findIndex(val => val.id === id); // ищем товар с id по индексу
    
    if( itemIdx === -1) {                                   // если товар не найден
        bucket.push({ ...data, count: 1});                  // предварительно создаем кол-во 1
    } else {
        bucket[itemIdx].count+=1;                           // если найден - добавляем кол-во +1
    }

    saveCardsToStore(bucket);                               // отправляем данные в localStorage
    cardEmit.emit('change');                                // на объекте 'card' будет происходить событие 'change'
}

const removeFromBucket = (data) => {    // удалить товар из корзины
    const bucket = getCartInStore();                        // достаем данные из localStorage
    const { id } = data;

    const itemIdx = bucket.findIndex(val => val.id === id); // ищем товар с id по индексу
    bucket.splice(itemIdx, 1);

    saveCardsToStore(bucket);                               // отправляем данные в localStorage
    cardEmit.emit('change');                                // на объекте 'card' будет происходить событие 'change'
}

const countPlus = (data) => {           // добавить количество товара
    const bucket = getCartInStore();                        // достаем данные из localStorage
    const { id } = data;

    const itemIdx = bucket.findIndex(val => val.id === id); // ищем товар с id по индексу
    
    if (bucket[itemIdx].count === 0) {
        bucket.splice(itemIdx, 1);
    } else {
        bucket[itemIdx].count++;
    }

    saveCardsToStore(bucket);                               // отправляем данные в localStorage
    cardEmit.emit('change');
}

const countMinus = (data) => {          // уменьшить кол-ва товара
    const bucket = getCartInStore();                        // достаем данные из localStorage
    const { id } = data;

    const itemIdx = bucket.findIndex(val => val.id === id); // ищем товар с id по индексу
    
    if (bucket[itemIdx].count === 0) {
        bucket.splice(itemIdx, 1);
    } else {
        bucket[itemIdx].count--;
    }

    saveCardsToStore(bucket);                               // отправляем данные в localStorage
    cardEmit.emit('change');
}

const renderProducts = async () => {    // карточка товара на сайте
    const goods = await getProducts()
    const cards = goods.reduce( (acc, item) => {
        acc = `${acc} <div сlass="cardsDecor">
            <img src="${item.image}" alt="${item.id}"><br>
            <p>${item.name}</p><br>
            <p class="cost">Вартість: ${item.price} грн</p><br>
            <button class="btn blue-grey lighten-3 addToBucket-btn"
                data-id=${item.id}
                data-name=${item.name}
                data-price=${item.price}
                data-image=${item.image}
            >
            Add to bucket
            </button>
        </div>`;
        return acc;
    }, '');

    const goodsList = document.querySelector('.goodsList');
    goodsList.innerHTML = cards;

    goodsList.querySelectorAll('.addToBucket-btn').forEach( (elem) => {
        elem.addEventListener('click', (ev) => {
            const { dataset } = ev.target;
            const data = { ...dataset };
            addToBucket(data);
        })
    })
};

const renderBucket = async () => {      // корзинка заказа с кликами по кнопкам
    const bucketData = await getCartInStore();

    const html = bucketData.reduce( (acc, item) => {
        acc.itemsHtml.push(`
        <tr class="lineItemOrder" data-id="${item.id}">
            <td><img src="${item.image}" alt="${item.id}" class="photoItemOrder"></td>
            <td><p class="nameItemOrder">${item.name}</p> </td>
            <td><p class="costItemOrder">${item.price}</p></td>
            <td class="countArrows">
                <button type="button" class="countMinus-btn" data-id="${item.id}"> - </button>
                <p class="countItemOrder">${item.count}</p>
                <button type="button" class="countPlus-btn" data-id="${item.id}"> + </button>
            </td>
            <td><p class="amountItemOrder">${item.price * item.count}</p></td>
            <td><button type="button" class="remove-btn" data-id="${item.id}">X</button></td>
        </tr>`);

        return acc;
    }, { itemsHtml: [] });

    const order = `${html.itemsHtml.join('')}`;
    bodyOfTableElem.innerHTML = order;

    bodyOfTableElem.querySelectorAll('.countPlus-btn').forEach( (item) => {
        item.addEventListener('click', (ev) => {
            const { dataset } = ev.target;
            const data = { ...dataset };
            countPlus(data);
        })
    })

    bodyOfTableElem.querySelectorAll('.countMinus-btn').forEach( (item) => {
        item.addEventListener('click', (ev) => {
            const { dataset } = ev.target;
            const data = { ...dataset };
            countMinus(data);
        })
    })

    bodyOfTableElem.querySelectorAll('.remove-btn').forEach( (item) => {
        item.addEventListener('click', (ev) => {
            const { dataset } = ev.target;
            const data = { ...dataset };
            removeFromBucket(data)
        })
    })

    const result = bucketData.reduce( (acc, item) => {
        acc += (item.price * item.count);
        return acc;
    }, 0);
    totalAmountElem.setAttribute('value', result);
    totalAmountElem.innerHTML = result;
};

const init = () => {                    // функция запуска других функций
    renderProducts();
    renderBucket();
    cardEmit.on('change', renderBucket);
}
init();

const formEl = document.forms.makeOrder; // форма со страницы
formEl.addEventListener('submit', async(ev) => {    // отправка данных формы заказа на сервер
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const jsonStore = localStorage.getItem('card');
    const amountResult = totalAmountElem.getAttribute('value');

    formData.append('order', jsonStore);
    formData.append('amount', amountResult);

    const { data } = await axios.post('/order', formData);

    document.forms['makeOrder'].reset();

    const bucket = getCartInStore();
    bucket.forEach( (item) => {
        removeFromBucket(item);
    })

    localStorage.clear();
    orderFormElem.classList.add('closed');
});

