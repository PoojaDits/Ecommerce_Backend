import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./Product";


@Entity("categories")
export default class Category {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type:"varchar", unique: true})
    name: string;
    @Column({type:"text", nullable:true})
    description: string|null;

    @OneToMany(()=>Product,(product)=>product.category)
    products: Product[];

}   