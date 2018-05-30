const environment = require('../environments')['sandbox'];
const Api = require('../api');
const batchCreateCFs = require('../custom-fields/batch-create');


const api = new Api(environment.host, environment.accessToken);

const createConfig = {
    customFieldNames: ['Product','Subproduct','Component', 'ProductRelation', 'SubproductRelation', 'ComponentRelation'],
    entityTypeIds: [4, 9, 27], //Epic, Feature, User story
    fieldType: 'Entity',
    isRequired: false,
    isSystem: true,
    excludedProcesses: ['Portfolio', 'Prod_Games', 'Prod_Melesta_Admin_Other', 'Prod_Mobile', 'Prod_Tech&Serv']
};

batchCreateCFs(api, createConfig);
