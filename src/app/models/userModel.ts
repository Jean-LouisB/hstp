import { Deserializable } from "./deserializable.model";
export class User implements Deserializable{

    id:string;
    matricule:string;
    nom:string;
    prenom:string;
    password:string; // ----------------  /!\ le mot de passe est exposé !! => prévoir une alternative plus sécure.
    responsable:string;
    present:string;
    type:number


    constructor(){}

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
    toString(){
        let str = "User : "+this.prenom+" - "+this.nom+" - "+this.present+" - "+this.responsable+" - "+this.id
        return str
    }

}