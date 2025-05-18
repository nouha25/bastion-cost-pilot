
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResourceContext } from "@/context/ResourceContext";
import { calculatePotentialSavings } from "@/data/mockData";

export const AdminPanel = () => {
  const { resources, currentUser } = useResourceContext();
  
  const totalResources = resources.length;
  const pendingResources = resources.filter(r => r.status === 'pending').length;
  const approvedForDeletion = resources.filter(r => r.status === 'approved_for_deletion').length;
  const potentialSavingsAmount = calculatePotentialSavings(resources);
  
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tableau de bord administrateur</CardTitle>
        <CardDescription>Vue d'ensemble des demandes de suppression</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Total des ressources</p>
            <p className="text-2xl font-bold">{totalResources}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">En attente de décision</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingResources}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">À supprimer</p>
            <p className="text-2xl font-bold text-red-600">{approvedForDeletion}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Économies potentielles</p>
            <p className="text-2xl font-bold text-green-600">{potentialSavingsAmount.toFixed(2)} €</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
