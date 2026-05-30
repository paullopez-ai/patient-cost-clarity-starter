@description('Azure region for the Container Registry.')
param location string

@description('Name of the Container Registry (must be globally unique, alphanumeric only).')
param name string

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
    publicNetworkAccess: 'Enabled'
  }
}

@description('Resource ID of the Container Registry.')
output id string = acr.id

@description('Name of the Container Registry.')
output registryName string = acr.name

@description('Login server of the Container Registry.')
output loginServer string = acr.properties.loginServer
