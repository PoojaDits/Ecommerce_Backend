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

  @Column({ type: "boolean" })
  isUsed: boolean;

  @Column({ type: "varchar" })
  userEmail: string;

  @Column({ type: "varchar" })
  purpose: string;
  
  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  
}       