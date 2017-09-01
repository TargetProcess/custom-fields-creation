const Api = require('/api');
const config = require('config');

const api = new Api(config.host, config.accessToken);
//todo kill the token


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

            //todo async → sync loop
            //customFields.forEach(f => api.post('customfields', f)
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
                ID: entityTypeId
            },
            Process: {
                ID: processId
            }
        }));

    return customFields;
}


function filterExistingCustomFields(customFieldNames, possibleCustomFields) {
    const fieldsFilter = `('${customFieldNames.join(`','`)}')`;
    return api.get('customfields', `Name in ${fieldsFilter}`)
        .then(existingCustomFields => {
            //todo check ID or Id
            const checkIfEqual = (a, b) => a['Name'] === b['Name']
                && a['Process']['ID'] === b['Process']['ID']
                && a['EntityType']['ID'] === b['EntityType']['ID'];

            return possibleCustomFields.filter(p => existingCustomFields.filter(e => checkIfEqual(e, p)).length === 0)
        });
}

setUpProductFields();
