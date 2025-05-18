
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResourceContext } from "@/context/ResourceContext";
import { ResourcesTable } from "./ResourcesTable";
import { ResourceCard } from "./ResourceCard";
import { Resource } from "@/types";

export const ResourceCategories = () => {
  const { resources } = useResourceContext();
  const [viewType, setViewType] = useState<"table" | "cards">("cards");

  // Separate resources into those that need action and historical resources
  const pendingResources = resources.filter(resource => resource.status === 'pending');
  
  // Historical resources are all those that are not pending
  const historicalResources = resources.filter(resource => resource.status !== 'pending');

  const renderResources = (filteredResources: Resource[]) => {
    if (viewType === "table") {
      return <ResourcesTable resources={filteredResources} />;
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Ressources Azure Bastion</h2>
        <Tabs defaultValue="cards" className="w-[200px]" onValueChange={(value) => setViewType(value as "table" | "cards")}>
          <TabsList>
            <TabsTrigger value="cards">Cartes</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-yellow-500 text-white rounded-full w-6 h-6 text-xs">
              {pendingResources.length}
            </span>
            <span>À traiter</span>
          </TabsTrigger>
          <TabsTrigger value="history">
            <span>Historique</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          {pendingResources.length > 0 ? (
            renderResources(pendingResources)
          ) : (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">Aucune ressource en attente de traitement</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          {historicalResources.length > 0 ? (
            renderResources(historicalResources)
          ) : (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">Aucun historique disponible</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
