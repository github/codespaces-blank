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


import Link from "next/link"

export default function Layout({ children } : { children: React.ReactNode }) {

        return (
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                  <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                  >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                  </Link>
        
        
                  {/* <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Orders</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Orders</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Package className="h-5 w-5" />
                        <span className="sr-only">Products</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Products</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Users2 className="h-5 w-5" />
                        <span className="sr-only">Customers</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Customers</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <LineChart className="h-5 w-5" />
                        <span className="sr-only">Analytics</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Analytics</TooltipContent>
                  </Tooltip> */}
        
                </nav>
                {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                </nav> */}
              </aside>
        
              <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                      <nav className="grid gap-6 text-lg font-medium">
                        <Link
                          href="#"
                          className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                          <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                          <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <Home className="h-5 w-5" />
                          Dashboard
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Orders
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-4 px-2.5 text-foreground"
                        >
                          <Package className="h-5 w-5" />
                          Products
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <Users2 className="h-5 w-5" />
                          Customers
                        </Link>
                        <Link
                          href="#"
                          className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <LineChart className="h-5 w-5" />
                          Settings
                        </Link>
                      </nav>
                    </SheetContent>
                  </Sheet>
        
        
        
                </header>
        
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  <Tabs defaultValue="all">
        
                    <div className="flex items-center">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="add" className="hidden sm:flex">Add</TabsTrigger>
                      </TabsList>
                    </div>
        
        
                    <TabsContent value="all">
                      <Card>
                        <CardHeader>
                          <CardTitle>Products</CardTitle>
                          <CardDescription>
                            Manage your products and view their sales performance.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                  <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Price
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Total Sales
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Created at
                                </TableHead>
                                <TableHead>
                                  <span className="sr-only">Actions</span>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  Laser Lemonade Machine
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Draft</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $499.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  25
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2023-07-12 10:42 AM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  Hypernova Headphones
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Active</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $129.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  100
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2023-10-18 03:21 PM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  AeroGlow Desk Lamp
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Active</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $39.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  50
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2023-11-29 08:15 AM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  TechTonic Energy Drink
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">Draft</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $2.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  0
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2023-12-25 11:59 PM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  Gamer Gear Pro Controller
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Active</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $59.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  75
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2024-01-01 12:00 AM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="hidden sm:table-cell">
                                  <Image
                                    alt="Product image"
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/placeholder.svg"
                                    width="64"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">
                                  Luminous VR Headset
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Active</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $199.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  30
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  2024-02-14 02:14 PM
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                        <CardFooter>
                          <div className="text-xs text-muted-foreground">
                            Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                            products
                          </div>
                        </CardFooter>
                      </Card>
                    </TabsContent>
        
        
                    <TabsContent value="posts">
                      <h1 className="h1">Posts</h1>
                      <Posts/>
                    </TabsContent>
        
                    <TabsContent value="users">
                      <h1>Users</h1>
                    </TabsContent>
        
                    <TabsContent value="add" className="">
        
                      <Tabs defaultValue="addPost">
                        <TabsList>
                          <TabsTrigger value="addPost">Add Post</TabsTrigger>
                          <TabsTrigger value="addUser">Add User</TabsTrigger>
                        </TabsList>
        
                        <TabsContent value="addPost">
                          <h1>Add Post</h1>
                        </TabsContent>
        
                        <TabsContent value="addUser">
                          <h1>Add User</h1>
                        </TabsContent>
                      </Tabs>
        
        
        
        
                    </TabsContent>
        
        
        
                  </Tabs>
        
        

                </main>
        
                
                <div>
                    {children}
                </div>
        
              </div>
            </div>
          )
    
}