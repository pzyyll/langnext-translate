// ABOUTME: Shared type definitions for model providers and model items.
// ABOUTME: Single source of truth consumed by all Models-related components.

export interface ModelItem {
  id: string
  name: string
}

export interface ModelProvider {
  id: string
  name: string
  icon?: string
  color?: string
  enabled: boolean
  authType: string
  apiKey: string
  apiUrl: string
  apiUrlPreview?: string
  docUrl?: string
  modelDocUrl?: string
  models: ModelItem[]
}
