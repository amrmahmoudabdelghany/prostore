'use client' ; 

import { MoonIcon, SunIcon, SunMoon, SunMoonIcon } from 'lucide-react';
import { Button } from '../../button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../dropdown-menu'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react';

const ModeToggle = () => {
    const {theme , setTheme}  = useTheme() ; 
    const [mounted , setMounted] = useState(false) ; 
 
    useEffect(()=>{ 
        setMounted(true) ; 
    } , [])

    if(!mounted) { 
        return null ; 
    }
  return (
   <DropdownMenu>
    <DropdownMenuTrigger asChild> 
        <Button variant='ghost' className='focus-visible:ring-0 focus-visible:ring-offset-0' > 
          {
            theme === 'system'  ? (  <SunMoon />) : theme === 'dark' ? (<MoonIcon />) :(<SunIcon/>)
          }
        </Button>
        
        </DropdownMenuTrigger>
      <DropdownMenuContent> 
          <DropdownMenuLabel> 
            Apperance
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={()=>setTheme('system')}>
            System 
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={()=>setTheme('dark')}>
            Dark 
            </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem  checked={theme === 'light'} onClick={()=>setTheme('light')}>
            Light
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
   </DropdownMenu>
  )
}

export default ModeToggle