import { Deserializable } from "./deserializable.model";
export class Heure implements Deserializable{
    
    id: string | null;
    matricule: string;
    bornes: string;
    duree: number;
    commentaire: string;
    date_evenement: string;
    valide: number; 
    
    constructor(matricule: string,bornes: string,duree:number, commentaire: string, date_evenement: string,id: string = null){
        this.id = id;
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