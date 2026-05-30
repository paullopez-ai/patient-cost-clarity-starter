# Patient Cost Clarity - Azure Infrastructure

Bicep infrastructure-as-code for the Patient Cost Clarity project.

## Modules

| Module | File | Description |
|--------|------|-------------|
| OpenAI | `modules/openai.bicep` | Azure OpenAI account with `gpt-5.4` and `text-embedding-3-large` deployments |
| Search | `modules/search.bicep` | Azure AI Search service (Basic tier) |
| Key Vault | `modules/key-vault.bicep` | Azure Key Vault with RBAC authorization |
| Registry | `modules/registry.bicep` | Azure Container Registry (Basic tier) |
| Monitoring | `modules/monitoring.bicep` | Log Analytics workspace and Application Insights |
| Container Apps | `modules/container-apps.bicep` | Container Apps environment with frontend and backend apps |

## Role Assignments

The Container Apps use system-assigned managed identities with the following roles:

**Backend:**
- Cognitive Services OpenAI User (on the OpenAI account)
- Search Index Data Reader (on the Search service)
- Key Vault Secrets User (on the Key Vault)

**Frontend:**
- Key Vault Secrets User (on the Key Vault)

## Prerequisites

- Azure CLI (`az`) installed and authenticated
- A resource group created (e.g. `rg-patient-cost-clarity-demo`)
- Container images pushed to the ACR (build and push before deploying)

## Deployment

1. Create the resource group (if it does not exist):

```bash
az group create --name rg-patient-cost-clarity-demo --location eastus
```

2. Deploy the infrastructure:

```bash
az deployment group create \
  --resource-group rg-patient-cost-clarity-demo \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/parameters.bicepparam \
  --parameters frontendImage=$ACR_LOGIN_SERVER/frontend:latest backendImage=$ACR_LOGIN_SERVER/backend:latest
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `location` | `eastus` | Azure region |
| `projectName` | `patient-cost-clarity` | Project name prefix |
| `environment` | `demo` | Environment name |
| `frontendImage` | *(required)* | Frontend container image reference |
| `backendImage` | *(required)* | Backend container image reference |
| `openAiCapacityTpm` | `30` | TPM capacity for GPT-5.4 deployment |
