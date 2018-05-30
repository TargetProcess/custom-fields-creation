module.exports = (api, config) => {
    return api.get('processes')
        .then(processes => {
            const filteredProcesses = processes.filter(p => !config.excludedProcesses.includes(p['Id']));
            const possibleCustomFields = generateCFs(filteredProcesses, config);

            const fieldsFilter = `('${config.customFieldNames.join(`','`)}')`;
            return api.get('customfields', { filter: `Name in ${fieldsFilter}` })
                .then(existingCustomFields => {
                    const checkIfEqual = (a, b) => a['Name'] === b['Name']
                        && a['Process']['Id'] === b['Process']['Id']
                        && a['EntityType']['Id'] === b['EntityType']['Id'];

                    return possibleCustomFields.filter(p => existingCustomFields.filter(e => checkIfEqual(e, p)).length === 0)
                })
                .then(customFields => {
                    return filteredProcesses
                        .map(p => customFields.filter(cf => cf['Process']['Id'] === p['Id']))
                        .filter(processCFs => processCFs.length > 0)
                        .reduce((promise, processCFs) => promise.then(res => api.post('customfields', processCFs, { isBulk: true })), Promise.resolve());
                });
        });
};


function generateCFs(processes, config) {
    const customFields = [];

    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

    cartesian(config.customFieldNames, processes.map(p => p['Id']), config.entityTypeIds)
        .forEach(([customFieldName, processId, entityTypeId]) => customFields.push({
            Name: customFieldName,
            FieldType: config.fieldType,
            Required: config.isRequired,
            IsSystem: config.isSystem,
            EntityType: {
                Id: entityTypeId
            },
            Process: {
                Id: processId
            }
        }));

    return customFields;
}
