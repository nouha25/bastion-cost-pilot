
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceProvider } from "@/context/ResourceContext";
import { Header } from "@/components/Header";
import { ResourcesTable } from "@/components/ResourcesTable";
import { ResourceCard } from "@/components/ResourceCard";
import { AdminPanel } from "@/components/AdminPanel";
import { useResourceContext } from "@/context/ResourceContext";

const ResourcesOverview = () => {
  const { resources } = useResourceContext();
  const [viewType, setViewType] = useState<"table" | "cards">("cards");

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
      
      <div>
        {viewType === "table" ? (
          <ResourcesTable />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ResourceProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow p-6 max-w-7xl mx-auto w-full space-y-6">
          <AdminPanel />
          <ResourcesOverview />
        </div>
      </div>
    </ResourceProvider>
  );
};

export default Index;
