
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useResourceContext } from "@/context/ResourceContext";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, Check, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import { RitmDialog } from "./RitmDialog";
import { Resource } from "@/types";

interface ResourcesTableProps {
  resources: Resource[];
}

export const ResourcesTable = ({ resources }: ResourcesTableProps) => {
  const { approveForDeletion, rejectForDeletion, adminApproveDelete, adminRejectDelete, currentUser } = useResourceContext();
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isRitmDialogOpen, setIsRitmDialogOpen] = useState(false);
  
  const isUser = currentUser?.role === 'user';
  const isAdmin = currentUser?.role === 'admin';

  // Formater la date en français
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const handleRejectClick = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setIsRitmDialogOpen(true);
  };

  const handleRitmConfirm = (ritmNumber: string) => {
    if (selectedResourceId) {
      rejectForDeletion(selectedResourceId, ritmNumber);
      setIsRitmDialogOpen(false);
      setSelectedResourceId(null);
    }
  };

  const selectedResource = selectedResourceId ? resources.find(r => r.id === selectedResourceId) : null;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Région</TableHead>
              <TableHead>Groupe de ressources</TableHead>
              <TableHead>Dernière utilisation</TableHead>
              <TableHead className="text-right">Coût mensuel</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Numéro RITM</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => {
              const isPending = resource.status === 'pending';
              const isApprovedForDeletion = resource.status === 'approved_for_deletion';
              
              return (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.region}</TableCell>
                  <TableCell>{resource.resourceGroup}</TableCell>
                  <TableCell>{formatDate(resource.lastUsed)}</TableCell>
                  <TableCell className="text-right text-red-600">{resource.costPerMonth.toFixed(2)} €</TableCell>
                  <TableCell>
                    <StatusBadge status={resource.status} />
                  </TableCell>
                  <TableCell>{resource.ritmNumber || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isUser && isPending && (
                        <>
                          <Button
                            onClick={() => approveForDeletion(resource.id)}
                            size="icon"
                            variant="destructive"
                            title="Approuver la suppression"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleRejectClick(resource.id)}
                            size="icon"
                            variant="outline"
                            title="Conserver"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {isAdmin && isApprovedForDeletion && (
                        <>
                          <Button
                            onClick={() => adminApproveDelete(resource.id)}
                            size="icon"
                            variant="destructive"
                            title="Confirmer la suppression"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => adminRejectDelete(resource.id)}
                            size="icon"
                            variant="outline"
                            title="Rejeter la suppression"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedResource && (
        <RitmDialog
          isOpen={isRitmDialogOpen}
          onClose={() => setIsRitmDialogOpen(false)}
          onConfirm={handleRitmConfirm}
          resourceName={selectedResource.name}
        />
      )}
    </>
  );
};
