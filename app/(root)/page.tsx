
import { Metadata } from "next";

import ProductList from "@/components/ui/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { convertToPlainObject } from "@/lib/utils";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

export const metadata: Metadata = {
   title : "Home"
}

const delay = (ms : number)=> new Promise((resolve)=>setTimeout(resolve , ms)) ; 

export default async function Home() {

    
   const latestProducts = await getLatestProducts() ;


 // await delay(25000); 

  return (<>
   
   <ProductList data={latestProducts} title="Newest Arrivals" limit={LATEST_PRODUCTS_LIMIT}/>
  
  </>);
}
