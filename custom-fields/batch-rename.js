module.exports = (api, config) => {
    const names = Object.keys(config.newNames).map(n => `"${n}"`).join(',');
    return api.get('customfields', { filter: `Name in (${names})` })
        .then(customFields => {
            const renamedCustomFields = customFields
                .filter(cf => !config.excludedProcesses.includes(cf['Process']['Id']) &&
                               config.entityTypeIds.includes(cf['EntityType']['Id']))
                .map(cf => ({
                    Id: cf['Id'],
                    Name: config.newNames[cf['Name']]
                }));

            api.post('customfields', renamedCustomFields, { isBulk: true });
        })
};
