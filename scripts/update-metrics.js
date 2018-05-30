const environment = require('../environments')['staging'];
const Api = require('../api');

const batchUpdateMetrics = require('../metrics/batch-update');


const api = new Api(environment.host, environment.accessToken);

const config = {
    newNames: {
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
    },
    newCustomFields: {
        'Product': 'ProductText',
        'Subproduct': 'SubproductText',
        'Component': 'ComponentText',
        'ProductRelation': 'ProductRelationText',
        'SubproductRelation': 'SubproductRelationText',
        'ComponentRelation': 'ComponentRelationText'
    }
};

batchUpdateMetrics(api, config);