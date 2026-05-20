import { AppDataSource } from "../config/dataSource";
import { Otp } from "../entities/Otp";
import { sendOtpEmail } from "./mailService";
import crypto from "crypto";
import { MESSAGES } from "../constants/messages";
import { OtpPurpose } from "../enums";
const otpRepo=AppDataSource.getRepository(Otp);

const generateOtpCode=():string=>{
    return crypto.randomInt(100000,999999).toString();
}

export const createAndSendOtp=async(userEmail:string,purpose:OtpPurpose):Promise<void> =>{
//to clear old values

    await otpRepo.update(
        {
            userEmail:userEmail,purpose,is_used:false
        },
        {
            is_used:true
        }
    );

    const code=generateOtpCode();
    const expiresAt=new Date(Date.now()+10*60*1000);
    
    const otp=otpRepo.create({
        code,
        expiresAt,
        is_used:false,
        userEmail:userEmail,
        purpose,
        user:null,
    });

    await otpRepo.save(otp);
    
    try {
        await sendOtpEmail(userEmail,code);
    } catch (error) {
        await otpRepo.delete({ id: otp.id });
        throw error;
    }
};
 export const verifyOtp=async(userEmail:string,purpose:OtpPurpose,code:string):Promise<boolean> =>{

    const otp=await otpRepo.findOne({
        where:{userEmail:userEmail,purpose,code,is_used:false},
    });

    if(!otp){
        throw new Error(MESSAGES.OTP.INVALID);

    }
    if(new Date()>new Date(otp.expiresAt)){
        throw new Error(MESSAGES.OTP.EXPIRED);
    }
    return true;
}
export const consumeOtp=async(
    userEmail:string,
    purpose:OtpPurpose,
    code:string
):Promise<void> =>{
    const otp=await otpRepo.update(
        {userEmail:userEmail,purpose,code,is_used:false},
        {is_used:true}
    );
        };
