import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Posts() {

    const users = await prisma.user.findMany({})




    return (
        <div>
            {
                users.map((user: User) => (
                    <div key={user.id} className="py-5">
                        <Card className="">
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>


                                <CardDescription>
                                    {user.email}
                                </CardDescription>


                            </CardHeader>
                            <CardContent className="px-10">
                                <p>{"Created at " + user.createdAt.toDateString()}</p>
                                <p>{"Last time updated at " + user.updatedAt.toDateString()}</p>
                            </CardContent>

                        </Card>

                    </div>
                ))
            }
        </div>
    );
}