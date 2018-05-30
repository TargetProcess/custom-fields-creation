module.exports = (api, config) => {
    const updates = [
        {
            id: 'rename',
            filter: m => config.newNames && Object.keys(config.newNames).includes(m.name),
            update: m => Object.assign({}, m, { name: config.newNames[m.name] })
        },
        {
            id: 'replaceCustomField',
            filter: m => config.newCustomFields && m.customMetricSettings && Object.keys(config.newCustomFields).includes(m.customMetricSettings.targetCustomFieldName),
            update: m => {
                const currentCF = m.customMetricSettings.targetCustomFieldName;
                const updatedCustomMetricSettings = Object.assign({}, m.customMetricSettings, { targetCustomFieldName: config.newCustomFields[currentCF] });
                return Object.assign({}, m, { customMetricSettings: updatedCustomMetricSettings })
            }
        }
    ];


    return api.get('metrics')
        .then(existingMetrics => {
            const updatedMetrics = existingMetrics
                .filter(m => updates.some(u => u.filter(m)))
                .map(m => updates.reduce((metric, u) => u.filter(metric) ? u.update(metric) : metric, m));

            return updatedMetrics.reduce((promise, m) =>
                promise.then(res => api.post('metrics', m, { id: m.id })), Promise.resolve());
        });
};
