@description('Azure region for the OpenAI resource.')
param location string

@description('Base name for the OpenAI account.')
param name string

@description('TPM capacity for GPT-5.4 deployment.')
param capacityTpm int = 30

resource openAi 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: name
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: name
    publicNetworkAccess: 'Enabled'
  }
}

resource gpt54 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAi
  name: 'gpt-5.4'
  sku: {
    name: 'Standard'
    capacity: capacityTpm
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5.4'
      version: '2026-03-01'
    }
  }
}

resource embedding 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAi
  name: 'text-embedding-3-large'
  sku: {
    name: 'Standard'
    capacity: 30
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-3-large'
      version: '1'
    }
  }
  dependsOn: [
    gpt54
  ]
}

@description('Resource ID of the OpenAI account.')
output id string = openAi.id

@description('Name of the OpenAI account.')
output accountName string = openAi.name

@description('Endpoint of the OpenAI account.')
output endpoint string = openAi.properties.endpoint
