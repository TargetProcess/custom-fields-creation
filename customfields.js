const Api = require('./api');
const config = require('./config')['sandbox'];

const api = new Api(config.host, config.accessToken);


function setUpProductFields() {
    const customFieldNames = ['Product','Subproduct','Component', 'ProductRelation', 'SubproductRelation', 'ComponentRelation'];
    const entityTypeIds = [4,9,27]; //Epic, Feature and User Story
    const portfolioProcesses = ['Portfolio', 'Prod_Games', 'Prod_Melesta_Admin_Other', 'Prod_Mobile', 'Prod_Tech&Serv'];

    return api.get('processes')
        .then(processes => {
            const processIds = processes
                .filter(p => !portfolioProcesses.includes(p['Name']))
                .map(p => p['Id']);
            return generateCustomFields(customFieldNames, processIds, entityTypeIds);
        })
        .then(possibleCustomFields => filterExistingCustomFields(customFieldNames, possibleCustomFields))
        .then(customFields => {
            customFields.sort(f => f['Name']);

            return customFields
                //.filter(customField => customField['Process']['Id'] === 15)
                //.slice(0, 5)
                //.forEach(customField => api.post('customfields', customField))
                .reduce((promise, customField) => promise.then(res => api.post('customfields', customField)), Promise.resolve());
        });
}


function generateCustomFields(customFieldNames, processIds, entityTypeIds) {
    const customFields = [];

    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

    cartesian(customFieldNames, processIds, entityTypeIds)
        .forEach(([customFieldName, processId, entityTypeId]) => customFields.push({
            Name: customFieldName,
            FieldType: 'Text',
            Required: false,
            IsSystem: true,
            EntityType: {
                Id: entityTypeId
            },
            Process: {
                Id: processId
            }
        }));

    return customFields;
}


function filterExistingCustomFields(customFieldNames, possibleCustomFields) {
    const fieldsFilter = `('${customFieldNames.join(`','`)}')`;
    return api.get('customfields', `Name in ${fieldsFilter}`)
        .then(existingCustomFields => {
            const checkIfEqual = (a, b) => a['Name'] === b['Name']
                && a['Process']['Id'] === b['Process']['Id']
                && a['EntityType']['Id'] === b['EntityType']['Id'];

            return possibleCustomFields.filter(p => existingCustomFields.filter(e => checkIfEqual(e, p)).length === 0)
        });
}

setUpProductFields();
