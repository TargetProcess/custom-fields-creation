module.exports = {
    sandbox: {
        host: 'http://localhost/Targetprocess',
        accessToken: '{ACCESS_TOKEN}',
        customFieldNames: ['Product','Subproduct','Component'],
        entityTypeIds: [4,9,27], //Epic, Feature, User story
        excludedProcesses: ['Portfolio', 'Product Portfolio']
    },
    production: {
        host: 'https://example.tpondemand.com',
        accessToken: '{ACCESS_TOKEN}',
        customFieldNames: ['Product','Subproduct','Component'],
        entityTypeIds: [4,9,27], //Epic, Feature, User story
        excludedProcesses: ['Portfolio', 'Product Portfolio']
    }
};
