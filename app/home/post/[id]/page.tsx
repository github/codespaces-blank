import { Post, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function Home({ params }: { params: { id: string } }) {



    const post:Post = await prisma.post.findUnique({
        where: {
            id: params.id
        }
    })

    async function getAuthorName(id: string) {
        const author = await prisma.user.findUnique({
            where: {
                id: id || 'cjioeuvo8'
            }
        })
        return author?.name
    }

    const author = await getAuthorName(post.authorId as string)

    return (
        <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {post.title}
            </h1>

            <p className="text-sm text-muted-foreground">{author}</p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                {post.content}
            </p>
        </div>
    )
}