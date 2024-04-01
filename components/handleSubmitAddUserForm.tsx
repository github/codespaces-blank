import { PrismaClient } from "@prisma/client/extension";
import { log } from "console";
const prisma = new PrismaClient();

export default async function handleSubmitAddUserForm(name:string, email:string) {
    
    
    console.log(name, email);
    const add = prisma.user.create({
        data: {
            name,
            email
        }
    });

    const isAdded = async () => {
        

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            if (user) {
                console.log('User added successfully');
                return true
            }

            return false
        
        }

    const added = await isAdded();


    if (added == true) {
        console.log('User added successfully');
        return true
    }
    }

// Path: components/AddUserForm.tsx
