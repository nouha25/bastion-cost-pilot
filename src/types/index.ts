
export type ResourceStatus = 'pending' | 'approved_for_deletion' | 'rejected_for_deletion' | 'deletion_approved' | 'deletion_rejected' | 'deleted';

export interface Resource {
  id: string;
  name: string;
  type: string;
  region: string;
  costPerMonth: number;
  lastUsed: string;
  status: ResourceStatus;
  subscriptionId: string;
  resourceGroup: string;
  ritmNumber?: string; // Ajout du numéro RITM
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
