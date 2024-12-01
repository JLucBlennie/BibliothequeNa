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
}[];

interface BiblothequeNAContextType {
    bdd: bddType;
    setBdd: (value: bddType) => void;
}

const BiblothequeNAContext = createContext<BiblothequeNAContextType | undefined>(undefined);

// Provider
export const BiblothequeNAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bdd, setBdd] = useState<bddType>(bddJSONFirst);

    return (
        <BiblothequeNAContext.Provider value={{ bdd, setBdd }}>
            {children}
        </BiblothequeNAContext.Provider>
    );
};

// Hook pour utiliser le contexte
export const useBiblothequeNAContext = (): BiblothequeNAContextType => {
    const context = useContext(BiblothequeNAContext);
    if (!context) {
        throw new Error("useMyContext must be used within a BiblothequeNAProvider");
    }
    return context;
};