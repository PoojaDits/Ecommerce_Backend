import { 
    Column, 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    BeforeInsert, 
    BeforeUpdate 
} from "typeorm";
import slugify from "slugify";
import Product from "./Product";

@Entity("categories")
export default class Category {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar", unique: true })
    name: string;

    // Added slug column
    @Column({ type: "varchar", unique: true })
    slug: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    // Auto-generates slug before saving
    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.name) {
            this.slug = slugify(this.name, {
                lower: true,      
                strict: true,     
                trim: true        
            });
        }
    }
}
