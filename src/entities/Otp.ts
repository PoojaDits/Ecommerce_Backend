import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("otps")
export class Otp {

    @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "varchar" })
  expiresAt: Date;

  @Column({ name: "is_used", type: "boolean" })
  is_used: boolean;

  @Column({ type: "varchar" })
  userEmail: string;

  @Column({ type: "varchar" })
  purpose: string;

  
  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' , nullable:true})
  @JoinColumn({ name: 'user_id' })
  user: User|null;
  
}       