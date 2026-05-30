@description('Azure region for the Search service.')
param location string

@description('Name of the Search service.')
param name string

resource search 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'basic'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'enabled'
  }
}

@description('Resource ID of the Search service.')
output id string = search.id

@description('Name of the Search service.')
output searchName string = search.name

@description('Endpoint of the Search service.')
output endpoint string = 'https://${search.name}.search.windows.net'
