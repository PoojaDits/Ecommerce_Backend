import { Request, Response } from "express";
import { createCategory } from "../services/categoryService";
export {createCategorySchema} from "../validators/categoryValidator"; 
import { MESSAGES } from "../constants/messages";
import { createCategorySchema } from "../validators/categoryValidator";

export const createCategoryHandler= async (
    req: Request,
    res: Response
    ): Promise<void> => {
        try {
       const {error,value}=createCategorySchema.validate(req.body);
       if(error){
        res.status(400).json({
            success:false,
            message:error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED
        });
        return;
       }
       const(name, description)=value;
       const category=await createCategory(name,description);
         res.status(201).json({
          success:true,
          message:MESSAGES.CATEGORY.CREATED_SUCCESSFULLY,
        category,
        });
          }catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : MESSAGES.CATEGORY.CREATION_FAILED;
            res.status(400).json({ success: false, message });
          }
    };

