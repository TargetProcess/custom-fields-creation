const config = require('./environments')['staging'];
const Api = require('./api');

const batchCreateCFs = require('./custom-fields/batch-create');
const batchRenameCFs = require('./custom-fields/batch-rename');


const api = new Api(config.host, config.accessToken);


const renameConfig = Object.assign({
    newNames: {
        'Product': 'ProductText',
        'Subproduct': 'SubproductText',
        'Component': 'ComponentText',
        'ProductRelation': 'ProductRelationText',
        'SubproductRelation': 'SubproductRelationText',
        'ComponentRelation': 'ComponentRelationText',
    },
    entityTypeIds: [4, 9, 27]
}, config);


batchRenameCFs(api, renameConfig);


const createConfig = Object.assign({
    customFieldNames: ['Product','Subproduct','Component', 'ProductRelation', 'SubproductRelation', 'ComponentRelation'],
    entityTypeIds: [4, 9, 27], //Epic, Feature, User story
    fieldType: 'Entity',
    isRequired: false,
    isSystem: true
}, config);

//batchCreateCFs(api, createConfig);
