
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Resource, User } from '../types';
import { mockResources, mockUsers } from '../data/mockData';
import { toast } from '@/components/ui/use-toast';
import { 
  fetchResources, 
  approveResourceForDeletion, 
  rejectResourceForDeletion,
  adminApproveDelete as apiAdminApproveDelete,
  adminRejectDelete as apiAdminRejectDelete
} from '@/services/apiService';

interface ResourceContextType {
  resources: Resource[];
  currentUser: User | null;
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  approveForDeletion: (resourceId: string) => void;
  rejectForDeletion: (resourceId: string, ritmNumber: string) => void;
  adminApproveDelete: (resourceId: string) => void;
  adminRejectDelete: (resourceId: string) => void;
  loginAsUser: (userId: string) => void;
  loginAsAdmin: () => void;
  loading: boolean;
  error: string | null;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Pour le développement
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les ressources depuis l'API
  const loadResources = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchResources(token || undefined);
      setResources(data);
    } catch (err) {
      setError("Erreur lors du chargement des ressources");
      console.error(err);
      // Pour le développement, utilisez les données mock en cas d'erreur
      setResources(mockResources);
    } finally {
      setLoading(false);
    }
  };

  // Charger les ressources au démarrage et quand l'utilisateur change
  useEffect(() => {
    loadResources();
  }, [currentUser, token]);

  // Utilisateur approuve la suppression
  const approveForDeletion = async (resourceId: string) => {
    setLoading(true);
    try {
      const updatedResource = await approveResourceForDeletion(resourceId, token || undefined);
      
      // Mise à jour optimiste de l'UI
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
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la suppression. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Utilisateur rejette la suppression
  const rejectForDeletion = async (resourceId: string, ritmNumber: string) => {
    setLoading(true);
    try {
      const updatedResource = await rejectResourceForDeletion(resourceId, ritmNumber, token || undefined);
      
      // Mise à jour optimiste de l'UI
      setResources(prev =>
        prev.map(resource =>
          resource.id === resourceId
            ? { ...resource, status: 'rejected_for_deletion', ritmNumber }
            : resource
        )
      );
      
      toast({
        title: "Suppression rejetée",
        description: `Vous avez choisi de conserver cette ressource avec le numéro RITM: ${ritmNumber}`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la suppression. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Admin approuve la suppression définitive
  const adminApproveDelete = async (resourceId: string) => {
    setLoading(true);
    try {
      const updatedResource = await apiAdminApproveDelete(resourceId, token || undefined);
      
      // Mise à jour optimiste de l'UI
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
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la suppression. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Admin rejette la suppression définitive
  const adminRejectDelete = async (resourceId: string) => {
    setLoading(true);
    try {
      const updatedResource = await apiAdminRejectDelete(resourceId, token || undefined);
      
      // Mise à jour optimiste de l'UI
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
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la suppression. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pour l'instant, conservation des fonctions de mock pour le développement
  const loginAsUser = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    if (user) {
      setCurrentUser(user);
      setToken("mock-token-user"); // En réalité, vous récupéreriez un token d'API
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
      setToken("mock-token-admin"); // En réalité, vous récupéreriez un token d'API
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
        loading,
        error
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
