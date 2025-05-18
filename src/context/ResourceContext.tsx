
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Resource, User } from '../types';
import { mockResources, mockUsers } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';

interface ResourceContextType {
  resources: Resource[];
  currentUser: User | null;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  approveForDeletion: (resourceId: string) => void;
  rejectForDeletion: (resourceId: string) => void;
  adminApproveDelete: (resourceId: string) => void;
  adminRejectDelete: (resourceId: string) => void;
  loginAsUser: (userId: string) => void;
  loginAsAdmin: () => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);

  // Utilisateur approuve la suppression
  const approveForDeletion = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, status: 'approved_for_deletion' }
          : resource
      )
    );
    toast({
      title: "Approuvé pour suppression",
      description: "Votre demande de suppression a été transmise aux administrateurs.",
    });
  };

  // Utilisateur rejette la suppression
  const rejectForDeletion = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, status: 'rejected_for_deletion' }
          : resource
      )
    );
    toast({
      title: "Suppression rejetée",
      description: "Vous avez choisi de conserver cette ressource.",
    });
  };

  // Admin approuve la suppression définitive
  const adminApproveDelete = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, status: 'deletion_approved' }
          : resource
      )
    );
    toast({
      title: "Suppression approuvée",
      description: "La suppression a été approuvée par l'administrateur.",
      variant: "destructive",
    });
  };

  // Admin rejette la suppression définitive
  const adminRejectDelete = (resourceId: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === resourceId
          ? { ...resource, status: 'deletion_rejected' }
          : resource
      )
    );
    toast({
      title: "Suppression rejetée",
      description: "La suppression a été rejetée par l'administrateur.",
    });
  };

  // Connexion en tant qu'utilisateur
  const loginAsUser = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "Connecté",
        description: `Connecté en tant que ${user.name}`,
      });
    }
  };

  // Connexion en tant qu'admin
  const loginAsAdmin = () => {
    const admin = mockUsers.find(user => user.role === 'admin');
    if (admin) {
      setCurrentUser(admin);
      toast({
        title: "Connecté",
        description: `Connecté en tant qu'administrateur`,
      });
    }
  };

  return (
    <ResourceContext.Provider
      value={{
        resources,
        currentUser,
        setResources,
        approveForDeletion,
        rejectForDeletion,
        adminApproveDelete,
        adminRejectDelete,
        loginAsUser,
        loginAsAdmin,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResourceContext = (): ResourceContextType => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
};
