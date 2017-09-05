const fetch = require('node-fetch');


module.exports = class {
    constructor (host, accessToken) {
        this.host = host;
        this.accessToken = accessToken;
    }

    get(resource, filter = '', takeCount = 10000) {
        const url = `${this.host}/api/v1/${resource}?format=json&where=${filter}&take=${takeCount}&access_token=${this.accessToken}`;

        return fetch(url)
            .then(res => res.json())
            .then(json => json['Items'])
            .catch(error => {
                console.log(error);
                return error;
            });
    }


    post(resource, payload) {
        return fetch(`${this.host}/api/v1/${resource}?resultFormat=json&access_token=${this.accessToken}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                console.log(res['status']);
                return res;
            })
            .catch(error => {
                console.log(error);
                return error;
            });
    }
};
