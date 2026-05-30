@description('Azure region for monitoring resources.')
param location string

@description('Base name for monitoring resources.')
param name string

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${name}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${name}-insights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

@description('Resource ID of the Log Analytics workspace.')
output logAnalyticsId string = logAnalytics.id

@description('Name of the Log Analytics workspace.')
output logAnalyticsName string = logAnalytics.name

@description('Customer ID of the Log Analytics workspace.')
output logAnalyticsCustomerId string = logAnalytics.properties.customerId

@description('Shared key of the Log Analytics workspace.')
output logAnalyticsSharedKey string = logAnalytics.listKeys().primarySharedKey

@description('Resource ID of Application Insights.')
output appInsightsId string = appInsights.id

@description('Instrumentation key for Application Insights.')
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey

@description('Connection string for Application Insights.')
output appInsightsConnectionString string = appInsights.properties.ConnectionString
