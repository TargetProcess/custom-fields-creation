module.exports = (api, config) => {
    const names = Object.keys(config.newNames).map(n => `"${n}"`).join(',');
    const filter = `Name in (${names})`;
    return api.get('customfields', filter)
        .then(customFields => {
            const renamedCustomFields = customFields
                .filter(cf => !config.excludedProcesses.includes(cf['Process']['Name']) &&
                               config.entityTypeIds.includes(cf['EntityType']['Id']))
                .map(cf => ({
                    Id: cf['Id'],
                    Name: config.newNames[cf['Name']]
                }));

            api.post('customfields', renamedCustomFields, true);
        })
};
