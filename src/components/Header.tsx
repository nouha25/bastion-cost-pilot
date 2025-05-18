
import { Button } from "@/components/ui/button";
import { useResourceContext } from "@/context/ResourceContext";
import { Database, Server, Shield } from "lucide-react";

export const Header = () => {
  const { currentUser, loginAsUser, loginAsAdmin } = useResourceContext();

  return (
    <header className="bg-[#0078D4] text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Server className="h-6 w-6" />
          <h1 className="text-xl font-bold">Azure Bastion Optimizer</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <Shield className="h-5 w-5" />
              ) : (
                <Database className="h-5 w-5" />
              )}
              <span>{currentUser.name}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-[#0078D4] hover:bg-gray-100"
              onClick={() => loginAsUser('1')}
            >
              Utilisateur
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-[#0078D4] hover:bg-gray-100"
              onClick={() => loginAsAdmin()}
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
