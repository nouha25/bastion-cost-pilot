
import { Resource, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jean Martin',
    email: 'jean.martin@exemple.fr',
    role: 'user',
  },
  {
    id: '2',
    name: 'Marie Dubois',
    email: 'marie.dubois@exemple.fr',
    role: 'user',
  },
  {
    id: '3',
    name: 'Admin Système',
    email: 'admin@exemple.fr',
    role: 'admin',
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'bastion-prod-westeurope',
    type: 'Azure Bastion',
    region: 'West Europe',
    costPerMonth: 138.70,
    lastUsed: '2023-04-12',
    status: 'pending',
    subscriptionId: 'sub-prod-01',
    resourceGroup: 'rg-network-prod',
  },
  {
    id: '2',
    name: 'bastion-dev-northeurope',
    type: 'Azure Bastion',
    region: 'North Europe',
    costPerMonth: 138.70,
    lastUsed: '2023-05-01',
    status: 'approved_for_deletion',
    subscriptionId: 'sub-dev-01',
    resourceGroup: 'rg-network-dev',
  },
  {
    id: '3',
    name: 'bastion-test-westeurope',
    type: 'Azure Bastion',
    region: 'West Europe',
    costPerMonth: 138.70,
    lastUsed: '2023-03-15',
    status: 'pending',
    subscriptionId: 'sub-test-01',
    resourceGroup: 'rg-network-test',
  },
  {
    id: '4',
    name: 'bastion-uat-francecentral',
    type: 'Azure Bastion',
    region: 'France Central',
    costPerMonth: 138.70,
    lastUsed: '2023-02-28',
    status: 'deletion_approved',
    subscriptionId: 'sub-uat-01',
    resourceGroup: 'rg-network-uat',
  },
  {
    id: '5',
    name: 'bastion-prod-francecentral',
    type: 'Azure Bastion',
    region: 'France Central',
    costPerMonth: 138.70,
    lastUsed: '2023-05-10',
    status: 'rejected_for_deletion',
    subscriptionId: 'sub-prod-02',
    resourceGroup: 'rg-network-prod-fc',
  },
];

// Fonction helper pour calculer les économies potentielles
export const calculatePotentialSavings = (resources: Resource[]): number => {
  return resources
    .filter(resource => ['pending', 'approved_for_deletion'].includes(resource.status))
    .reduce((total, resource) => total + resource.costPerMonth, 0);
};

// Fonction pour obtenir une couleur en fonction du statut
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'approved_for_deletion':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'rejected_for_deletion':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'deletion_approved':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'deletion_rejected':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'deleted':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

// Fonction pour obtenir le libellé du statut en français
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'approved_for_deletion':
      return 'Approuvé pour suppression';
    case 'rejected_for_deletion':
      return 'Rejeté pour suppression';
    case 'deletion_approved':
      return 'Suppression approuvée';
    case 'deletion_rejected':
      return 'Suppression rejetée';
    case 'deleted':
      return 'Supprimé';
    default:
      return status;
  }
};
