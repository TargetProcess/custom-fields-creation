const fetch = require('node-fetch');


module.exports = class {
    constructor (host, accessToken) {
        this.host = host;
        this.accessToken = accessToken;
    }

    _getEndpoint(resource) {
        return {
            'metrics': `${this.host}/api/metricsetup/v1`
        }[resource] || `${this.host}/api/v1/${resource}`;
    }

    get(resource, config = {}) {
        const filter = config.filter ? `&where=${config.filter}` : '';
        const takeCount = config.takeCount || 1000;

        return fetch(`${this._getEndpoint(resource)}?format=json${filter}&take=${takeCount}&access_token=${this.accessToken}`)
            .then(res => res.json())
            .then(json => json['Items'] || json['items'])
            .catch(error => {
                console.log(error);
                return error;
            });
    }


    post(resource, payload, config = {}) {
        const gateway = config.isBulk ? '/bulk' : config.id ? `/${config.id}` : '';

        return fetch(`${this._getEndpoint(resource)}${gateway}?resultFormat=json&access_token=${this.accessToken}`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                console.log(`${new Date().toLocaleString()}: ${res['status']}`);
                return res;
            })
            .catch(error => {
                console.log(error);
                return error;
            });
    }
};
