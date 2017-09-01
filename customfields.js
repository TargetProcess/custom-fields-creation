const fetch = require('node-fetch');

const hostname = 'https://tpsandbox.wargaming.net';
const accessToken = 'NDY3OkV2NW9ETWgxWCt6SnNDM0FwZEM1VU5RQnlRM1RyV1UwNms5SjhVWUIyVWs9';



//const filter =  and IsSystem eq true`;

function get(resource, filter = '', takeCount = 1000) {
    const url = `${hostname}/api/v1/${resource}?format=json&where=${filter}&take=${takeCount}&access_token=${accessToken}`;
    return fetch(url)
        .then(res => res.json())
        .then(json => json['Items'])
        .catch(error => console.error(error));
}


function post(resource, payload) {
    fetch(`${hostname}/api/v1/${entityTypeResourceName}?resultFormat=json&access_token=${accessToken}`, {
        method: 'POST',
        body: JSON.stringify(cf),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => console.log(res))
    .catch(error => console.log(error));
}


function getProcesses(customFieldNames) {
    const fieldsFilter = `('${customFieldNames.join(`','`)}')`;
    return get('customfields', `(Name in ${fieldsFilter}) and (IsSystem eq 'true')`)
        .then(existingCustomFields => [...new Set(existingCustomFields.map(f => f['Process']['Name']))])
        .then (existingProcesses => {
            return get('processes')
                .then(processes => {
                    const portfolioProcesses = ['Portfolio', 'Prod_Games', 'Prod_Melesta_Admin_Other', 'Prod_Mobile', 'Prod_Tech&Serv'];
                    const excludedProcesses = [...portfolioProcesses, ...existingProcesses];
                    return processes
                        .filter(p => ![...excludedProcesses, ...existingProcesses].includes(p))
                        .map(p => p['Id']);
                });
        });
}


function prepareCustomFields(customFieldNames, processIds, entityTypeIds) {
    const fieldsToCreate = [];

    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

    cartesian(customFieldNames, processIds, entityTypeIds)
        .forEach(([customFieldName, processId, entityTypeId]) => fieldsToCreate.push({
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

    return fieldsToCreate;
}


function setUpProductFields() {
    const customFieldNames = ['Product','Subproduct','Component', 'ProductRelation', 'SubproductRelation', 'ComponentRelation'];
    const entityTypeIds = [4,9,27];

    return getProcesses(customFieldNames)
        .then(processIds => prepareCustomFields(customFieldNames, processIds, entityTypeIds))
        .then(customFields => console.log(customFields));
}

setUpProductFields();

//4,9,27
//15

// const cf = {
//     Name: 'Product',
//     FieldType: 'Text',
//     Required: false,
//     IsSystem: true,
//     EntityType: {
//         ID: 4
//     },
//     Process: {
//         ID: 15
//     }
// };
//
// console.log(JSON.stringify(cf));
//
// fetch(`${hostname}/api/v1/${entityTypeResourceName}?resultFormat=json&access_token=${accessToken}`, {
//         method: 'POST',
//         body: JSON.stringify(cf),
//         headers: { 'Content-Type': 'application/json' }
//     })
//     .then(res => console.log(res))
//     .catch(error => console.log(error));
