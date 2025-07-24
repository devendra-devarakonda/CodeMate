import model from '../models/user.model.js';


export const createuser = async ({email,password})=>{


    if(!email || !password){
        throw new Error("Email and Password should be required");
    }

    const hash = await model.hashPassword(password);

    const user = await model.create({
        email:email,
        password:hash
    });

    return user;
}
