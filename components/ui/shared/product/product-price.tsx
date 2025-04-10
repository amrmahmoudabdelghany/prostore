
import { cn } from "@/lib/utils";


const ProductPrice = ({value , className} : {value : number , className?:string}) => {

    const strValue = value.toFixed(2) ; 

    const [int , float] = strValue.split(".") ; 


  return (
   <p className={cn('text-xl' , className)}> 

    <span className="text-xs align-super"> 
       $
    </span>
    {int}
    <span className="text-xs align-super"> 
       .{float}
    </span>
    </p>
  )
}

export default ProductPrice