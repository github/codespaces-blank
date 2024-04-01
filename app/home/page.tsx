import Image from "next/image"

import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Posts from '../components/Posts'
import Users from "../components/Users"
import { AddPostForm } from "@/components/AddPostForm"
import { AddUserForm } from "@/components/add-user-form"

export default function HomePage() {
    return (
        <div>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  <Tabs defaultValue="posts">
        
                    <div className="flex items-center">
                      <TabsList>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="add">Add</TabsTrigger>
                      </TabsList>
                    </div>

        
        
                    <TabsContent value="posts">
                      <h1 className="h1">Posts</h1>
                      <Posts/>
                    </TabsContent>
        
                    <TabsContent value="users">
                      <h1>This is a list of all Users Blog</h1>
                      <Users />
                    </TabsContent>
        
                    <TabsContent value="add" className="">
        
                      <Tabs defaultValue="addPost">
                        <TabsList>
                          <TabsTrigger value="addPost">Add Post</TabsTrigger>
                          <TabsTrigger value="addUser">Add User</TabsTrigger>
                        </TabsList>
        
                        <TabsContent value="addPost">
                          <AddPostForm/>
                        </TabsContent>
        
                        <TabsContent value="addUser">
                          <h1>Add User</h1>
                          <AddUserForm/>
                        </TabsContent>
                      </Tabs>
        
        
        
        
                    </TabsContent>
        
        
        
                  </Tabs>
        
        

                </main>
        </div>
    )
}