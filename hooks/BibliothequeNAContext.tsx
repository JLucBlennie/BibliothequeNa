import React, { createContext, useState, ReactNode, useContext } from "react";
import bddJSONFirst from '@/assets/data/bibna.json';

// Définir les types
export type bddType = {
    id: number;
    isbn: string;
    name: string;
    author: string;
    image: string;
    note: string;
    statut: string;
    comment: string;
}[];

interface BibliothequeNAContextType {
    bdd: bddType;
    setBdd: (value: bddType) => void;
}

const BibliothequeNAContext = createContext<BibliothequeNAContextType | undefined>(undefined);

// Provider
export const BibliothequeNAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bdd, setBdd] = useState<bddType>(bddJSONFirst);

    return (
        <BibliothequeNAContext.Provider value={{ bdd, setBdd }}>
            {children}
        </BibliothequeNAContext.Provider>
    );
};

// Hook pour utiliser le contexte
export const useBibliothequeNAContext = (): BibliothequeNAContextType => {
    const context = useContext(BibliothequeNAContext);
    if (!context) {
        throw new Error("useMyContext must be used within a BibliothequeNAProvider");
    }
    return context;
};