@description('Azure region for the Container Apps environment.')
param location string

@description('Base name for the Container Apps resources.')
param name string

@description('Container image for the frontend app.')
param frontendImage string

@description('Container image for the backend app.')
param backendImage string

@description('Log Analytics workspace customer ID.')
param logAnalyticsCustomerId string

@description('Log Analytics workspace shared key.')
@secure()
param logAnalyticsSharedKey string

@description('Application Insights connection string.')
param appInsightsConnectionString string

@description('Resource ID of the Azure OpenAI account.')
param openAiId string

@description('Endpoint of the Azure OpenAI account.')
param openAiEndpoint string

@description('Resource ID of the Azure AI Search service.')
param searchId string

@description('Endpoint of the Azure AI Search service.')
param searchEndpoint string

@description('Resource ID of the Key Vault.')
param keyVaultId string

@description('URI of the Key Vault.')
param keyVaultUri string

@description('Login server of the Container Registry.')
param registryLoginServer string

@description('Name of the Container Registry.')
param registryName string

// ---------- Container Apps Environment ----------

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${name}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsCustomerId
        sharedKey: logAnalyticsSharedKey
      }
    }
  }
}

// ---------- ACR credential lookup ----------

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' existing = {
  name: registryName
}

// ---------- Backend Container App ----------

resource backend 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${name}-backend'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: false
        targetPort: 8000
        transport: 'http'
      }
      registries: [
        {
          server: registryLoginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: backendImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'AZURE_OPENAI_ENDPOINT', value: openAiEndpoint }
            { name: 'AZURE_SEARCH_ENDPOINT', value: searchEndpoint }
            { name: 'AZURE_KEY_VAULT_URI', value: keyVaultUri }
            { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsightsConnectionString }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
      }
    }
  }
}

// ---------- Frontend Container App ----------

resource frontend 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${name}-frontend'
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: environment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'http'
      }
      registries: [
        {
          server: registryLoginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'frontend'
          image: frontendImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'BACKEND_URL', value: 'https://${backend.properties.configuration.ingress.fqdn}' }
            { name: 'AZURE_KEY_VAULT_URI', value: keyVaultUri }
            { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsightsConnectionString }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
      }
    }
  }
}

// ---------- Role Assignments ----------

// Cognitive Services OpenAI User — backend
resource backendOpenAiRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiId, backend.id, 'CognitiveServicesOpenAIUser')
  scope: az.resourceId('Microsoft.CognitiveServices/accounts', split(openAiId, '/')[8])
  properties: {
    principalId: backend.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd')
  }
}

// Search Index Data Reader — backend
resource backendSearchRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(searchId, backend.id, 'SearchIndexDataReader')
  scope: az.resourceId('Microsoft.Search/searchServices', split(searchId, '/')[8])
  properties: {
    principalId: backend.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '1407120a-92aa-4202-b7e9-c0e197c71c8f')
  }
}

// Key Vault Secrets User — backend
resource backendKvRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVaultId, backend.id, 'KeyVaultSecretsUser')
  scope: az.resourceId('Microsoft.KeyVault/vaults', split(keyVaultId, '/')[8])
  properties: {
    principalId: backend.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

// Key Vault Secrets User — frontend
resource frontendKvRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVaultId, frontend.id, 'KeyVaultSecretsUser')
  scope: az.resourceId('Microsoft.KeyVault/vaults', split(keyVaultId, '/')[8])
  properties: {
    principalId: frontend.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
  }
}

@description('FQDN of the frontend Container App.')
output frontendFqdn string = frontend.properties.configuration.ingress.fqdn

@description('FQDN of the backend Container App.')
output backendFqdn string = backend.properties.configuration.ingress.fqdn

@description('Principal ID of the backend managed identity.')
output backendPrincipalId string = backend.identity.principalId

@description('Principal ID of the frontend managed identity.')
output frontendPrincipalId string = frontend.identity.principalId
