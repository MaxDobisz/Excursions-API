import ExcursionsAPI from "./ExcursionsAPI";
const api = new ExcursionsAPI();

class Helpers {
    constructor() {
        this.excursionsPanelEl = document.querySelector('.panel__excursions');
    }
    
    removeChildElements(parentEl) {
        while(!parentEl.lastElementChild.className.includes('prototype')) {
            parentEl.removeChild(parentEl.lastElementChild);
        }
    }

    addElToDom(parentEl, childEl) {
        parentEl.appendChild(childEl);
    }

    loadExcursionsToDom () {
        this.removeChildElements(this.excursionsPanelEl);
        
        return api.loadData()
            .then(excursionsArr => {
                excursionsArr.forEach(excursionObj => this.createDomEl(excursionObj)) 
            })
            .catch(err => console.log(err));
    }

    createDomEl(excursionObj) {
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
        
        this.addElToDom(this.excursionsPanelEl, newExcursionEl);
    }

    clearElValue(...arr) {
        arr.forEach(el => el.value = '');
    }
}

export default Helpers;