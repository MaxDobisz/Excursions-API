import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import Helpers from './helpers'
const api = new ExcursionsAPI();
const helpers = new Helpers(); 

document.addEventListener('DOMContentLoaded', init);

function init() {
    helpers.loadExcursionsToDom();
    addExcursionToApi();
    deleteExcursion();
    editExcursion();
}

function addExcursionToApi() {
    const formEl = document.querySelector('.form');

    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const [title, description, adultPrice, childPrice] = e.target.elements;       

        if(title.value && description.value && adultPrice.value && childPrice.value) {
            
            const excursionObj = {
                title: title.value,
                description: description.value,
                adultPrice: adultPrice.value,
                childPrice: childPrice.value
            }

            api.addData(excursionObj, 'excursions')
                .catch(err => console.log(err))
                .finally(() => {
                    helpers.loadExcursionsToDom(),
                    helpers.clearElValue(title, description, adultPrice, childPrice)
                });
                    
        } else {
            alert('Wypelnij wszystkie pola');
        }        
    });
}

function deleteExcursion() {
    helpers.excursionsPanelEl.addEventListener('click', (e) => {
        e.preventDefault();
        
        if(e.target.className.includes('remove')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement;
            const excursionElId = excursionEl.dataset.id;
            
            api.removeData(excursionElId)
                .catch(err => console.log(err))
                .finally(() => helpers.loadExcursionsToDom());
        }
    })
}

function editExcursion() {
    helpers.excursionsPanelEl.addEventListener('click', (e) => {
        e.preventDefault();
        
        if(e.target.className.includes('excursions__field-input--update')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement;
            const isEditable = excursionEl.isContentEditable;
            const editButton = excursionEl.querySelector('.excursions__field-input--update');
           
            if(isEditable) {
                const excursionId = excursionEl.dataset.id;
                const titleEl = excursionEl.querySelector('.excursions__title');
                const descriptionEl = excursionEl.querySelector('.excursions__description');
                const adultPriceEl = excursionEl.querySelector('.adult-price' );
                const childPriceEl = excursionEl.querySelector('.child-price');

                const excursionObj = {
                    title: titleEl.innerText,
                    description: descriptionEl.innerText,
                    adultPrice: adultPriceEl.innerText,
                    childPrice: childPriceEl.innerText
                };

                api.updateData(excursionId, excursionObj)
                    .catch(err => console.error(err))
                    .finally(() => {
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