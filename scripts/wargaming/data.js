module.exports = {
    excludedProcesses: [ 6, 25, 26, 28, 29, 85 ], //check if Ids are the same on production
    entityTypes: [
        { id: 27, name: 'epic' },
        { id: 9,  name: 'feature' },
        { id: 4,  name: 'userstory' }
    ],
    customFieldType: 'Entity',
    metrics: [
        {
            name: 'Product',
            entityTypes: [ "epic", "feature", "userstory" ],
            customMetricSettings: {
                formula: "IIF(SlaveRelations.Count(RelationType.Name==\"Link\" and slave.entityType.Name == \"Epic\") > 0, SlaveRelations.Where(RelationType.Name==\"Link\").select(slaveepic.Id).First(), IIF(SlaveRelations.Count(RelationType.Name==\"Link\" and slave.entityType.Name == \"Feature\" and slavefeature.epic != null) > 0, SlaveRelations.Where(RelationType.Name==\"Link\").select(slavefeature.epic.Id).First(), SlaveRelations.Where(RelationType.Name==\"Link\" and slaveuserstory.feature.epic != null).select(slaveuserstory.feature.epic.Id).First()))",
                targetCustomFieldName: "ProductRelation"
            }
        },
        {
            name: 'Subproduct',
            entityTypes: [ "epic", "feature", "userstory" ],
            customMetricSettings: {
                formula: "IIF(SlaveRelations.Count(RelationType.Name==\"Link\" and slave.entityType.Name == \"Feature\") > 0, SlaveRelations.Where(RelationType.Name==\"Link\" and slavefeature != null).select(slavefeature.Id).First(), SlaveRelations.Where(RelationType.Name==\"Link\" and slaveuserstory.feature != null).select(slaveuserstory.feature.Id).First())",
                targetCustomFieldName: "SubproductRelation"
            },
        },
        {
            name: 'Component',
            entityTypes: [ "epic", "feature", "userstory" ],
            customMetricSettings: {
                formula: "SlaveRelations.Where(RelationType.Name==\"Link\" and Slave.EntityType.Name == \"UserStory\").select(slaveuserstory.Id).First()",
                targetCustomFieldName: "ComponentRelation"
            },
        },
        {
            name: 'ProductEpic',
            entityTypes: [ "epic" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ProductRelation'] != null , CustomValues.Entity('ProductRelation').ID, null)",
                targetCustomFieldName: "Product"
            },
        },
        {
            name: 'SubproductEpic',
            entityTypes: [ "epic" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['SubproductRelation'] != null,  CustomValues.Entity('SubproductRelation').ID, null)",
                targetCustomFieldName: "Subproduct"
            },
        },
        {
            name: 'ComponentEpic',
            entityTypes: [ "epic" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ComponentRelation'] != null, CustomValues.Entity('ComponentRelation').ID, null)",
                targetCustomFieldName: "Subproduct"
            },
        },
        {
            name: 'ProductFeature',
            entityTypes: [ "feature" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ProductRelation']!= null, CustomValues.Entity('ProductRelation').ID, epic.CustomValues.Entity('Product').ID)",
                targetCustomFieldName: "Product"
            },
        },
        {
            name: 'SubproductFeature',
            entityTypes: [ "feature" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['SubproductRelation'] !=null, CustomValues.Entity('SubproductRelation').ID,  IIF(CustomValues['ProductRelation'] == null, epic.CustomValues.Entity('Subproduct').ID, null))",
                targetCustomFieldName: "Subproduct"
            },
        },
        {
            name: 'ComponentFeature',
            entityTypes: [ "feature" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ComponentRelation'] != null, CustomValues.Entity('ComponentRelation').ID,  IIF(CustomValues['ProductRelation']==null and CustomValues['SubproductRelation']==null, epic.CustomValues.Entity('Component').ID, null))",
                targetCustomFieldName: "Component"
            },
        },
        {
            name: 'ProductStory',
            entityTypes: [ "userstory" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ProductRelation'] != null, CustomValues.Entity('ProductRelation').ID, feature.CustomValues.Entity('Product').ID)",
                targetCustomFieldName: "Product"
            },
        },
        {
            name: 'SubproductStory',
            entityTypes: [ "userstory" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['SubproductRelation'] !=null, CustomValues.Entity('SubproductRelation').ID, IIF(CustomValues['ProductRelation'] == null, feature.CustomValues.Entity('Subproduct').ID, null))",
                targetCustomFieldName: "Subproduct"
            },
        },
        {
            name: 'ComponentStory',
            entityTypes: [ "userstory" ],
            customMetricSettings: {
                formula: "IIF(CustomValues['ComponentRelation'] != null, CustomValues.Entity('ComponentRelation').ID,  IIF(CustomValues['ProductRelation']==null and CustomValues['SubproductRelation']==null, feature.CustomValues.Entity('Component').ID, null))",
                targetCustomFieldName: "Component"
            },
        }
    ],
};
