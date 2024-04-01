import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card" 


import { Post } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function Posts() {

    const posts = await prisma.post.findMany({})

    
    async function getAuthorName(id: string) {
        const author = await prisma.user.findUnique({
            where: {
                id: id || 'cjioeuvo8'
            }
        })
        return author?.name
    }

    return (
        <div>
            {
                posts.map((post: Post) => (
                    <div key={post.id} className="py-5">
                        <Card className="">
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>
                                    {/* {((post.published == true) ? "Publié" : "Non Publié") + ", by " + (async () => {return await getAuthorName(post.authorId as string)})} */}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-10">
                                <p>{post.content?.slice(0, 100).concat(" ...")}</p>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Link href={"home/post/" + post.id as string}>Read More</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                    </div>
                ))
            }
        </div>
    );
}