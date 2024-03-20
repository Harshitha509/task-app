
import Link from "next/link";

import { AlignJustify } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
Button
export default async function Navbar() {

  const { userId } = auth();
  const user = await currentUser();  
  return(   
    <nav className="h-14">
    <div className="flex w-full h-14 pt-4 justify-between fixed border-b  border-b-slate-300  p-6  bg-slate-200">
    <h1 className="text-xl font-bold ">TASKY</h1>
            <div className=" flex gap-5 ">
            <Link href={"/"} >
          Home
        </Link>
        <Link href={"/features"} >
          Features
        </Link>
       
        <Link href={"/about"} >
          About
        </Link>
        <div><DropdownMenu>
  <DropdownMenuTrigger><AlignJustify /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Link href={"/dashboard/tasks"}>Tasks</Link></DropdownMenuItem>
    <DropdownMenuItem><Link href={"/dashboard/backlogs"}>Backlogs</Link></DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu></div>
        <div className="w-10 flex rounded-lg"><ModeToggle  /></div>
        <div> {userId ? (
                            <div className='flex w-36 justify-end text-sm pr-5 gap-2 items-center'>
                                {user ? `${user.firstName} ${user.lastName}` : "User"} 
                                <UserButton afterSignOutUrl='/signin' />
                            </div>
                        ) : (
                            <div className='flex gap-4 items-center'>
                                <Button><Link href='/signup'>Sign up</Link></Button>
                                <Button><Link href='/signin'>Sign In</Link></Button>
                            </div>
                        )}</div>
            </div>
            
            </div>
            
        </nav>
        
       
    )
}