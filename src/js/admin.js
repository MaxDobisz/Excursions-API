import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
document.addEventListener('DOMContentLoaded', init);
const api = new ExcursionsAPI(); 

function init() {
    loadExcursionsToDom();
    addExcursionToApi();
    deleteExcursion();
    editExcursion();
}

const excursionsPanelEl = document.querySelector('.panel__excursions');

function loadExcursionsToDom () {
    removeChildElements(excursionsPanelEl);
    
    api.loadData()
        .then(excursionsArr => {
            excursionsArr.forEach( excursionObj => createDomEl(excursionObj) ) 
        })
        .catch(err => console.log(err));
}

function removeChildElements(parentEl) {
    while(!parentEl.lastElementChild.className.includes('prototype')) {
        parentEl.removeChild(parentEl.lastElementChild);
    }
}

function createDomEl(excursionObj) {
    const excursionElPrototype = document.querySelector('.excursions__item--prototype');
    const newExcursionEl = excursionElPrototype.cloneNode(true);
    newExcursionEl.classList.remove('excursions__item--prototype');
    newExcursionEl.dataset.id = excursionObj.id;
    const titleEl = newExcursionEl.querySelector('.excursions__title');
    titleEl.innerText = excursionObj.title;
    const descriptionEl = newExcursionEl.querySelector('.excursions__description');
    descriptionEl.innerText = excursionObj.description;
    const adultPriceEl = newExcursionEl.querySelector('.adult-price');
    adultPriceEl.innerText = excursionObj.adultPrice;
    const childPriceEl = newExcursionEl.querySelector('.child-price');
    childPriceEl.innerText = excursionObj.childPrice;
    
    addElToDom(excursionsPanelEl, newExcursionEl);
}

function addElToDom(parentEl, childEl) {
    parentEl.appendChild(childEl);
}

function addExcursionToApi() {
    const formEl = document.querySelector('.form');
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = e.target.elements[0];
        const description = e.target.elements[1];
        const adultPrice = e.target.elements[2];
        const childPrice = e.target.elements[3];

        if(title.value && description.value && adultPrice.value && childPrice.value) {
            
            const excursionObj = {
                title: title.value,
                description: description.value,
                adultPrice: adultPrice.value,
                childPrice: childPrice.value
            }

            api.addData(excursionObj, 'excursions')
                .catch(err => console.log(err))
                .finally(loadExcursionsToDom, clearElValue(title, description, adultPrice, childPrice));
        } else {
            alert('Wypelnij wszystkie pola');
        }        
    });
}

function clearElValue(...arr) {
    arr.forEach( el => el.value = '' );
}

function deleteExcursion() {
    excursionsPanelEl.addEventListener('click', (e) => {
        e.preventDefault();
        
        if(e.target.className.includes('remove')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement;
            const excursionElId = excursionEl.dataset.id;
            
            api.removeData(excursionElId)
                .catch(err => console.log(err))
                .finally(loadExcursionsToDom);
        }
    })
}

function editExcursion() {
    excursionsPanelEl.addEventListener('click', (e) => {
        e.preventDefault();
        
        if(e.target.className.includes('excursions__field-input--update')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement;
            const isEditable = excursionEl.isContentEditable;
            const editButton = excursionEl.querySelector('.excursions__field-input--update ');
           
            if(isEditable) {
                const excursionId = excursionEl.dataset.id;
                const titleEl = excursionEl.querySelector('.excursions__title');
                const descriptionEl = excursionEl.querySelector('.excursions__description');
                const adultPriceEl = excursionEl.querySelector('.adult-price');
                const childPriceEl = excursionEl.querySelector('.child-price');

                const excursionObj = {
                    title: titleEl.innerText,
                    description: descriptionEl.innerText,
                    adultPrice: adultPriceEl.innerText,
                    childPrice: childPriceEl.innerText
                };

                api.updateData(excursionId, excursionObj)
                    .catch(err => console.error(err))
                    .finally( () => {
                        excursionEl.contentEditable = false;
                        editButton.value = 'edytuj';
                    });
            } else {       
                excursionEl.contentEditable = true;  
                editButton.value = 'zapisz';
            }
        }
    })
}