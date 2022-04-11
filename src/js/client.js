import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
import Helpers from './helpers';
const api = new ExcursionsAPI();
const helpers = new Helpers();

document.addEventListener('DOMContentLoaded', init);

function init() {
    helpers.loadExcursionsToDom()
        .finally(() => addExcursionToSummary());
    submitOrder();
}

function addExcursionToSummary() {
    const excursionsFormElList = document.querySelectorAll('.excursions__form');
 
    excursionsFormElList.forEach(excursionsFormEl => {
        excursionsFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const amountAdult = excursionsFormEl.elements[0].value;
            const amountChild = excursionsFormEl.elements[1].value;

            const inputPattern = /^[1-9]{1}[0-9]?$/;
            
            if(inputPattern.test(amountAdult) && inputPattern.test(amountChild)) {
                removeErrorBorderColor(excursionsFormEl);
                
                if(excursionsFormEl.lastElementChild.className === 'wrong_value_text') {
                    removeExcursionItemErrorField(excursionsFormEl);
                }

                const summaryPanel = document.querySelector('.panel__summary');
                const summaryItemPrototype = summaryPanel.querySelector('.summary__item--prototype');
                const newSummaryItem = summaryItemPrototype.cloneNode(true);
                newSummaryItem.classList.remove('summary__item--prototype');
                newSummaryItem.classList.add('summary__item');
                const itemNameValue = excursionsFormEl.parentElement.firstElementChild.firstElementChild.innerText;
                const newSumaryItemNameEl =  newSummaryItem.querySelector('.summary__name');
                newSumaryItemNameEl.innerText = itemNameValue;
                const summaryPrices = newSummaryItem.querySelector('.summary__prices');
                const priceAdult = excursionsFormEl.querySelector('.adult-price').innerText;
                const priceChild = excursionsFormEl.querySelector('.child-price').innerText; 
                summaryPrices.innerText = `dorośli: ${amountAdult} x ${priceAdult}PLN, dzieci: ${amountChild} x ${priceChild}PLN`;
                const summaryTotalPrice = newSummaryItem.querySelector('.summary__total-price');
                summaryTotalPrice.innerText = `${amountAdult * priceAdult + amountChild * priceChild} PLN`;

                helpers.addElToDom(summaryPanel, newSummaryItem)
                helpers.clearElValue(excursionsFormEl.elements[0], excursionsFormEl.elements[1]);
                updateTotalPriceSummary();
                removeSummaryItem();
            } else {
                addErrorBorderColor(excursionsFormEl);

                if(excursionsFormEl.lastElementChild.className !== 'wrong_value_text') {
                    createErrorField(excursionsFormEl, 'Provide the correct value (0-99)');
                }
            }
        });
    });
}

function addErrorBorderColor(element) {
    element.classList.add('border-color-error');
}

function removeErrorBorderColor(element) {
    element.classList.remove('border-color-error');
}

function createErrorField(parent, innerText) {
    const nameError = document.createElement('p');
    nameError.innerText = innerText;
    nameError.classList.add('wrong_value_text');
    
    helpers.addElToDom(parent, nameError);
}

function removeExcursionItemErrorField(errorFieldItem) {
    errorFieldItem.removeChild(errorFieldItem.lastElementChild);
}

function removeSummaryItem() {
    const summaryPanel = document.querySelector('.panel__summary');
    const removeBtnsList = summaryPanel.querySelectorAll('.summary__btn-remove');
    
    removeBtnsList.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const summaryItem = e.target.parentElement.parentElement;
            summaryPanel.removeChild(summaryItem);
            
            updateTotalPriceSummary();
         })
    })
}

function updateTotalPriceSummary() {
    const summaryPanel = document.querySelector('.panel__summary');
    const totalPricesList = summaryPanel.querySelectorAll('.summary__total-price');
   
    let sum = 0;

    totalPricesList.forEach( el => {
        if(el.innerText) {
            sum += parseInt(el.innerText);
        }
    })

    const totalPriceSummary = document.querySelector('.order__total-price-value');
    totalPriceSummary.innerText = `${sum} PLN`;
}

function submitOrder() {
    const orderPanel = document.querySelector('.panel__order');

    orderPanel.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        if(nameIncorrect()) {
            createErrorField(orderPanel, 'Provide the correct name');
        }

        if(emailInccorect()) {
            createErrorField(orderPanel, 'Provide the correct email');
        }

        if(!nameIncorrect() && !emailInccorect()) {
            const order = createOrdersObj();
            api.addData(order, 'orders');
            clearInputs(orderPanel.elements.name, orderPanel.elements.email);
            removeSummaryItems();
            updateTotalPriceSummary();
            alert('Zamowienie zostalo zlozone');
        }
    });
}

function clearErrors() {
    const orderPanel = document.querySelector('.panel__order');

    while(orderPanel.lastElementChild.className.includes('wrong_value_text')) {
        orderPanel.removeChild(orderPanel.lastElementChild);
    }
}

function nameIncorrect() {
    const orderPanel = document.querySelector('.panel__order');
    const namePattern = /^[a-z]{2,}\s{1}[a-z]{2,}$/i;

    if(!namePattern.test(orderPanel.elements.name.value)) {
        return true;
    }
}

function emailInccorect() {
    const orderPanel = document.querySelector('.panel__order');
    const emailPattern = /^\w{1}[\w_-]*\w{1}[\w_-]*\w{1}@{1}\w{1}[\w_-]*\w{1}\.{1}\w+$/i;

    if(!emailPattern.test(orderPanel.elements.email.value)) {
        return true;
    }
}

function createOrdersObj() {
    const ordersArr = createOrdersArr();
    const orderPanel = document.querySelector('.panel__order');
    const excursionsTotalPricesValueEl = document.querySelector('.order__total-price-value');

    const order = {
        customerName: orderPanel.elements.name.value,
        customeEmail: orderPanel.elements.email.value,
        totalPrice: excursionsTotalPricesValueEl.innerText,
        details: ordersArr
    }

    return order;
}

function createOrdersArr() {
    const ordersList = [];
    const summaryItemsList = document.querySelectorAll('.summary__item');

    summaryItemsList.forEach( item => {
        const totalPriceEl = item.querySelector('.summary__total-price');

        const orderDetails = {
            name: item.firstElementChild.firstElementChild.innerText,
            price: totalPriceEl.innerText,
            orderDetails: item.lastElementChild.innerText
        }

        ordersList.push(orderDetails);
    })

    return ordersList;
}

function clearInputs(...inputs) {
    inputs.forEach(input => input.value = '');
}

function removeSummaryItems() {
    const panelSumarry = document.querySelector('.panel__summary');

    while(!panelSumarry.lastElementChild.className.includes('summary__item--prototype')) {
       panelSumarry.removeChild(panelSumarry.lastElementChild);
    }
}