import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { OtpPurpose } from "../enums";

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

  @Column({
    type: "enum",
    enum: OtpPurpose,
    default: OtpPurpose.REGISTRATION
  })
  purpose: OtpPurpose;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' , nullable:true})
  @JoinColumn({ name: 'user_id' })
  user: User|null;
  
}       