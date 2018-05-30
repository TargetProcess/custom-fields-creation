const environment = require('../../environments')['sandbox'];
const data = require('./data');
const Api = require('../../api');

const batchRenameCFs = require('../../custom-fields/batch-rename');
const batchCreateCFs = require('../../custom-fields/batch-create');
const batchUpdateMetrics = require('../../metrics/batch-update');
const batchCreateMetrics = require('../../metrics/batch-create');


const api = new Api(environment.host, environment.accessToken);


/*
const customFieldsRenameConfig = {
    newNames: {
        'Product': 'ProductText',
        'Subproduct': 'SubproductText',
        'Component': 'ComponentText',
        'ProductRelation': 'ProductRelationText',
        'SubproductRelation': 'SubproductRelationText',
        'ComponentRelation': 'ComponentRelationText',
    },
    entityTypeIds: [4, 9, 27],
    excludedProcesses: data.excludedProcesses
};

batchRenameCFs(api, customFieldsRenameConfig);

const customFieldNewNames = {
    'Product': 'ProductText',
    'Subproduct': 'SubproductText',
    'Component': 'ComponentText',
    'ProductEpic': 'ProductEpicText',
    'ProductFeature': 'ProductFeatureText',
    'ProductStory': 'ProductStoryText',
    'SubproductEpic': 'SubproductEpicText',
    'SubproductFeature': 'SubproductFeatureText',
    'SubproductStory': 'SubproductStoryText',
    'ComponentEpic': 'ComponentEpicText',
    'ComponentFeature': 'ComponentFeatureText',
    'ComponentStory': 'ComponentStoryText'
};
const metricsToUpdate = Object.keys(customFieldNewNames).map(n => customFieldNewNames[n]);

const metricsUpdateConfig = {
    metrics: metricsToUpdate,//data.metrics.map(m => m.name),
    newNames: customFieldNewNames,
    newCustomFields: {
        'Product': 'ProductText',
        'Subproduct': 'SubproductText',
        'Component': 'ComponentText',
        'ProductRelation': 'ProductRelationText',
        'SubproductRelation': 'SubproductRelationText',
        'ComponentRelation': 'ComponentRelationText'
    },
    shouldReplaceCFInFormulas: true
};

batchUpdateMetrics(api, metricsUpdateConfig);

const customFieldsCreateConfig = {
    customFieldNames: [...new Set(data.metrics.map(m => m.customMetricSettings.targetCustomFieldName))],
    entityTypeIds: data.entityTypes.map(et => et.id),
    fieldType: data.customFieldType,
    isRequired: false,
    isSystem: true,
    excludedProcesses: data.excludedProcesses
};

batchCreateCFs(api, customFieldsCreateConfig);

*/

const metricsCreateConfig = {
    metrics: data.metrics,
    excludedProcesses: data.excludedProcesses
};

batchCreateMetrics(api, metricsCreateConfig);
