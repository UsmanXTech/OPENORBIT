export type AssetCategory = "Community" | "Infrastructure" | "Tools" | "Governance" | "Rewards";
export type AssetTag = "trending" | "new" | "community";
export type AssetColor = "c1" | "c2" | "c3" | "c4" | "c5" | "c6";
export interface Asset { id: string; name: string; symbol: string; category: AssetCategory; description: string; priceLabel: string; marketCap: number; marketCapLabel: string; tag: AssetTag; color: AssetColor; initial: string; }
export type AssetFilter = "all" | "new" | "trending";
export type AssetSort = "featured" | "name" | "cap";
export interface LaunchDraft { name: string; symbol: string; supply: number; description: string; }
