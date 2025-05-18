
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useResourceContext } from "@/context/ResourceContext";
import { Resource } from "@/types";
import { Clock, Server } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  const { approveForDeletion, rejectForDeletion, adminApproveDelete, adminRejectDelete, currentUser } = useResourceContext();
  
  const isPending = resource.status === 'pending';
  const isApprovedForDeletion = resource.status === 'approved_for_deletion';
  const isUser = currentUser?.role === 'user';
  const isAdmin = currentUser?.role === 'admin';

  // Formater la date en français
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="border-l-4 hover:shadow-md transition-shadow duration-200" 
          style={{ borderLeftColor: isPending ? '#FFB900' : isApprovedForDeletion ? '#D13438' : '#107C10' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{resource.name}</CardTitle>
          <StatusBadge status={resource.status} />
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <Server className="h-4 w-4" />
          {resource.type} | {resource.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Groupe de ressources</p>
            <p className="font-medium">{resource.resourceGroup}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Abonnement</p>
            <p className="font-medium">{resource.subscriptionId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Coût mensuel</p>
            <p className="font-medium text-red-600">{resource.costPerMonth.toFixed(2)} €</p>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              Dernière utilisation: <span className="font-medium">{formatDate(resource.lastUsed)}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        {isUser && isPending && (
          <>
            <Button 
              onClick={() => approveForDeletion(resource.id)} 
              variant="destructive"
              className="flex-1"
            >
              Approuver la suppression
            </Button>
            <Button 
              onClick={() => rejectForDeletion(resource.id)} 
              variant="outline" 
              className="flex-1"
            >
              Conserver
            </Button>
          </>
        )}

        {isAdmin && isApprovedForDeletion && (
          <>
            <Button 
              onClick={() => adminApproveDelete(resource.id)} 
              variant="destructive"
              className="flex-1"
            >
              Confirmer la suppression
            </Button>
            <Button 
              onClick={() => adminRejectDelete(resource.id)} 
              variant="outline" 
              className="flex-1"
            >
              Rejeter la suppression
            </Button>
          </>
        )}

        {!isPending && !(isAdmin && isApprovedForDeletion) && (
          <p className="text-sm text-muted-foreground italic">
            {resource.status === 'rejected_for_deletion' && "Ressource conservée."}
            {resource.status === 'approved_for_deletion' && "En attente de validation admin."}
            {resource.status === 'deletion_approved' && "Suppression approuvée par l'admin."}
            {resource.status === 'deletion_rejected' && "Suppression rejetée par l'admin."}
            {resource.status === 'deleted' && "Ressource supprimée."}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
