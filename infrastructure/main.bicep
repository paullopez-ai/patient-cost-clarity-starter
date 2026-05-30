@description('Azure region for all resources.')
param location string

@description('Project name used as a prefix for resource names.')
param projectName string

@description('Environment name (e.g. demo, staging, prod).')
param environment string

@description('Container image for the frontend app (e.g. myacr.azurecr.io/frontend:latest).')
param frontendImage string

@description('Container image for the backend app (e.g. myacr.azurecr.io/backend:latest).')
param backendImage string

@description('TPM capacity for the GPT-5.4 deployment.')
param openAiCapacityTpm int = 30

// ---------- Naming ----------

var baseName = '${projectName}-${environment}'
var acrName = replace('${projectName}${environment}acr', '-', '')

// ---------- Modules ----------

module monitoring 'modules/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    name: baseName
  }
}

module openAi 'modules/openai.bicep' = {
  name: 'openai'
  params: {
    location: location
    name: '${baseName}-openai'
    capacityTpm: openAiCapacityTpm
  }
}

module search 'modules/search.bicep' = {
  name: 'search'
  params: {
    location: location
    name: '${baseName}-search'
  }
}

module keyVault 'modules/key-vault.bicep' = {
  name: 'key-vault'
  params: {
    location: location
    name: '${baseName}-kv'
  }
}

module registry 'modules/registry.bicep' = {
  name: 'registry'
  params: {
    location: location
    name: acrName
  }
}

module containerApps 'modules/container-apps.bicep' = {
  name: 'container-apps'
  params: {
    location: location
    name: baseName
    frontendImage: frontendImage
    backendImage: backendImage
    logAnalyticsCustomerId: monitoring.outputs.logAnalyticsCustomerId
    logAnalyticsSharedKey: monitoring.outputs.logAnalyticsSharedKey
    appInsightsConnectionString: monitoring.outputs.appInsightsConnectionString
    openAiId: openAi.outputs.id
    openAiEndpoint: openAi.outputs.endpoint
    searchId: search.outputs.id
    searchEndpoint: search.outputs.endpoint
    keyVaultId: keyVault.outputs.id
    keyVaultUri: keyVault.outputs.vaultUri
    registryLoginServer: registry.outputs.loginServer
    registryName: registry.outputs.registryName
  }
}

// ---------- Outputs ----------

@description('Frontend application URL.')
output frontendUrl string = 'https://${containerApps.outputs.frontendFqdn}'

@description('Backend application URL (internal).')
output backendUrl string = 'https://${containerApps.outputs.backendFqdn}'

@description('Azure OpenAI endpoint.')
output openAiEndpoint string = openAi.outputs.endpoint

@description('Azure AI Search endpoint.')
output searchEndpoint string = search.outputs.endpoint

@description('Key Vault URI.')
output keyVaultUri string = keyVault.outputs.vaultUri

@description('Container Registry login server.')
output acrLoginServer string = registry.outputs.loginServer

@description('Application Insights connection string.')
output appInsightsConnectionString string = monitoring.outputs.appInsightsConnectionString
