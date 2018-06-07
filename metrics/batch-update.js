const areArraysEqual = require('../helpers/are-arrays-equal');


module.exports = (api, config) => {
    const updates = [
        {
            id: 'rename',
            filter: m => config.newNames && Object.keys(config.newNames).includes(m.name),
            update: m => Object.assign({}, m, { name: config.newNames[m.name] })
        },
        {
            id: 'replaceCustomField',
            filter: m => config.newCustomFields &&
                         m.customMetricSettings &&
                         Object.keys(config.newCustomFields).includes(m.customMetricSettings.targetCustomFieldName),
            update: m => {
                const currentCF = m.customMetricSettings.targetCustomFieldName;
                const updatedCustomMetricSettings = Object.assign({}, m.customMetricSettings, { targetCustomFieldName: config.newCustomFields[currentCF] });
                return Object.assign({}, m, { customMetricSettings: updatedCustomMetricSettings })
            }
        },
        {
            id: 'replaceProcesses',
            filter: m => config.newProcesses && !areArraysEqual(config.newProcesses, m.specificProcessIds),
            update: m => Object.assign({}, m, { specificProcessIds: config.newProcesses })
        },
        {
            id: 'replaceCustomFieldsInFormulas',
            filter: m => config.shouldReplaceCFInFormulas &&
                         m.customMetricSettings &&
                         Object.keys(config.newCustomFields).some(cf => m.customMetricSettings.formula.includes(`['${cf}']`)),
            update: m => {
                const updatedFormula = Object.keys(config.newCustomFields).reduce((formula, cf) => {
                    let updatedString = formula; //new RegExp(`['${cf}']`, 'g') for some reason didn't work
                    while (updatedString.includes(`['${cf}']`)) {
                        updatedString = updatedString.replace(`['${cf}']`, `['${config.newCustomFields[cf]}']`);
                    }

                    return updatedString;
                }, m.customMetricSettings.formula);

                const updatedCustomMetricSettings = Object.assign({}, m.customMetricSettings, { formula: updatedFormula });
                return Object.assign({}, m, { customMetricSettings: updatedCustomMetricSettings })
            }
        }
    ];


    return api.get('metrics')
        .then(existingMetrics => {
            const updatedMetrics = existingMetrics
                .filter(m => (!config.metrics || config.metrics.includes(m.name)) && updates.some(u => u.filter(m)))
                .map(m => updates.reduce((metric, u) => u.filter(metric) ? u.update(metric) : metric, m));

            return updatedMetrics.reduce((promise, m) =>
                promise.then(res => api.post('metrics', m, { id: m.id })), Promise.resolve());
        });
};
