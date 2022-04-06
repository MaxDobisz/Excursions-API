class ExcursionsAPI {
    constructor() {
        this.apiUrl = 'http://localhost:3000';
    }

    _fetch(options, additionalPath = '/excursions') {
        const url = this.apiUrl + additionalPath;
        return fetch(url, options)
            .then(resp => {
                if(resp.ok) { return resp.json();}
                return Promise.reject(resp);
            })
    }
    
    loadData() {
        return this._fetch();
    }  

    addData(data, additionalPath = '') {
        const options = {
            method: 'POST',
            body: JSON.stringify( data ),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        return this._fetch(options, `/${additionalPath}`);
    }

    removeData(id) {
        const options = { method: 'DELETE'};
        return this._fetch(options, `/excursions/${id}`)
    }

    updateData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify( data ),
            headers: { 
                'Content-Type': 'application/json' 
            }
        };
        return this._fetch(options, `/excursions/${id}`);
    }
}

export default ExcursionsAPI;