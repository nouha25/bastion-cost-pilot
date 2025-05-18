
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResourceContext } from "@/context/ResourceContext";
import { ResourcesTable } from "./ResourcesTable";
import { ResourceCard } from "./ResourceCard";
import { Resource } from "@/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const ResourceCategories = () => {
  const { resources } = useResourceContext();
  const [viewType, setViewType] = useState<"table" | "cards">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter resources based on search query
  const filterBySearch = (resourceList: Resource[]) => {
    if (!searchQuery.trim()) return resourceList;
    
    const query = searchQuery.toLowerCase().trim();
    return resourceList.filter(resource => 
      resource.name.toLowerCase().includes(query) ||
      resource.resourceGroup.toLowerCase().includes(query) ||
      resource.region.toLowerCase().includes(query) ||
      (resource.ritmNumber && resource.ritmNumber.toLowerCase().includes(query))
    );
  };

  // Separate resources into those that need action and historical resources
  const pendingResources = filterBySearch(resources.filter(resource => resource.status === 'pending'));
  
  // Historical resources are all those that are not pending
  const historicalResources = filterBySearch(resources.filter(resource => resource.status !== 'pending'));

  const renderResources = (filteredResources: Resource[]) => {
    if (filteredResources.length === 0) {
      return (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">Aucune ressource trouvée</p>
        </div>
      );
    }
    
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Ressources Azure Bastion</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs defaultValue="cards" className="w-[200px]" onValueChange={(value) => setViewType(value as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="cards">Cartes</TabsTrigger>
              <TabsTrigger value="table">Tableau</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
          {renderResources(pendingResources)}
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          {renderResources(historicalResources)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
