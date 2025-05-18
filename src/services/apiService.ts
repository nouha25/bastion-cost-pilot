
import { Resource, User } from "../types";

// URL de base de vos Azure Functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://your-azure-function-app.azurewebsites.net/api";

// Headers par défaut pour toutes les requêtes
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Fonction helper pour ajouter le token d'authentification
const getAuthHeaders = (token?: string) => {
  if (token) {
    return {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }
  return defaultHeaders;
};

// Récupère toutes les ressources pour l'utilisateur actuel
export const fetchResources = async (token?: string): Promise<Resource[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des ressources:", error);
    throw error;
  }
};

// Approuve une ressource pour suppression
export const approveResourceForDeletion = async (resourceId: string, token?: string): Promise<Resource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/approve`, {
      method: "POST",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'approbation de la ressource:", error);
    throw error;
  }
};

// Rejette une ressource pour suppression avec un numéro RITM
export const rejectResourceForDeletion = async (
  resourceId: string, 
  ritmNumber: string, 
  token?: string
): Promise<Resource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/reject`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ ritmNumber }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors du rejet de la ressource:", error);
    throw error;
  }
};

// Admin: Approuve la suppression
export const adminApproveDelete = async (resourceId: string, token?: string): Promise<Resource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/resources/${resourceId}/approve`, {
      method: "POST",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'approbation admin:", error);
    throw error;
  }
};

// Admin: Rejette la suppression
export const adminRejectDelete = async (resourceId: string, token?: string): Promise<Resource> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/resources/${resourceId}/reject`, {
      method: "POST",
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors du rejet admin:", error);
    throw error;
  }
};

// Authentifie un utilisateur et récupère ses informations
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Erreur d'authentification: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    throw error;
  }
};
