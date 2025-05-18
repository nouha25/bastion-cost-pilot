
import { ResourceProvider } from "@/context/ResourceContext";
import { Header } from "@/components/Header";
import { AdminPanel } from "@/components/AdminPanel";
import { ResourceCategories } from "@/components/ResourceCategories";
import { useResourceContext } from "@/context/ResourceContext";

const ResourcesOverview = () => {
  return (
    <div className="space-y-6">
      <ResourceCategories />
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
