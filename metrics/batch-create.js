module.exports = (api, config) => {
    return api.get('processes')
        .then(processes => {
            const filteredProcesses = processes
                .map(p => p['Id'])
                .filter(p => !config.excludedProcesses.includes(p));

            const metrics = config.metrics.map(m => ({
                metricId: 'CustomFormulaMetric',
                name: m.name,
                description: m.description || '',
                specificProcessIds: filteredProcesses,
                entityTypes: m.entityTypes,
                customMetricSettings: m.customMetricSettings
            }));

            return metrics.reduce((promise, m) => promise.then(res => api.post('metrics', m)), Promise.resolve());
        });
};
