const environment = require('../../environments')['sandbox'];
const Api = require('../../api');
const data = require('./data');
const batchCreateCFs = require('../../custom-fields/batch-create');
const batchUpdateMetrics = require('../../metrics/batch-update');


const api = new Api(environment.host, environment.accessToken);


const customFieldsConfig = {
    customFieldNames: [...new Set(data.metrics.map(m => m.customMetricSettings.targetCustomFieldName))],
    entityTypeIds: data.entityTypes.map(et => et.id),
    fieldType: data.customFieldType,
    isRequired: false,
    isSystem: true,
    excludedProcesses: data.excludedProcesses
};

batchCreateCFs(api, customFieldsConfig)
    .then(result => {
        api.get('processes')
            .then(processes => {
                const filteredProcesses = processes
                    .map(p => p['Id'])
                    .filter(p => !data.excludedProcesses.includes(p));

                return batchUpdateMetrics(api, { metrics: data.metrics.map(m => m.name), newProcesses: filteredProcesses });
            });
    });
