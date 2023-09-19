import { Deserializable } from "./deserializable.model";
export class Heure implements Deserializable{
    
    matricule: string;
    bornes: string;
    duree: number;
    commentaire: string;
    date_evenement: string;
    valide: number; 
    
    constructor(matricule: string,bornes: string,duree:number, commentaire: string, date_evenement: string){
        this.matricule = matricule;
        this.bornes = bornes;
        this.duree = duree;
        this.commentaire=commentaire;
        this.date_evenement = date_evenement;
        this.valide = 0;
    }
    
    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
    
}