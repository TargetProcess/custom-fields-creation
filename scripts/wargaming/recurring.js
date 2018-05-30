const environment = require('../../environments')['sandbox'];
const Api = require('../../api');
const data = require('./data');
const batchCreateCFs = require('../../custom-fields/batch-create');


const api = new Api(environment.host, environment.accessToken);

/*
const customFieldsConfig = {
    customFieldNames: [...new Set(data.metrics.map(m => m.customMetricSettings.targetCustomFieldName))],
    entityTypeIds: data.entityTypes.map(et => et.id),
    fieldType: data.customFieldType,
    isRequired: false,
    isSystem: true,
    excludedProcesses: data.excludedProcesses
};

batchCreateCFs(api, customFieldsConfig);
*/


//create lacking custom fields (take from metrics data)
//update metrics with lacking processes
