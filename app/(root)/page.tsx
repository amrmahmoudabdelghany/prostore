import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import sampleData from '@/db/sample-data' ; 
import ProductList from "@/components/ui/shared/product/product-list";

export const metadata: Metadata = {
   title : "Home"
}

const delay = (ms : number)=> new Promise((resolve)=>setTimeout(resolve , ms)) ; 

export default async function Home() {



 // await delay(25000); 

  return (<>
   
   <ProductList data={sampleData.products} title="Newest Arrivals" limit={4}/>
  
  </>);
}
