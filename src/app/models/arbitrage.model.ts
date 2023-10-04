import { Deserializable } from "./deserializable.model";
export class Arbitrage implements Deserializable {

    //Données de l'enregritement
    matricule: string;
    date: Date;
    commentaire: string;
    //les compteurs à proprement parlé
    solidarite: number;
    recuperation: number;
    heuresSupMajoree: number;
    heureAPayer: number;
    //Le responsable    
    respValidationStatus: number;// 0 = en attente; 1 = validée; 2 = annulée  (3 = annulée avec l'import initial)
    respDateValidation: Date | null;
    //Action sur l'heure à payer
    paiementStatus: number | null; //0 = pas de demande; 1 = demande; 2 = validée ; 3 = payée(par RH)
    datePaiement:Date | null;

    constructor() {
    }


    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}