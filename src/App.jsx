import './App.css'
import { Navbar } from './layouts/navbar'
import { ProductCatalog } from './layouts/produkCatalog'
import { ListProduk } from './layouts/listProduct'
import { useState } from 'react'
import Footer from './layouts/footer'

function App() {
  const [refresh, setRefresh] = useState(false)

  return (
    <>
       <Navbar/>
       <div className='pt-5'>
         <div className='pt-16 px-5'>
            {/* untuk produk catalog */}
            <div className='w-[70%] pr-5'>
                <ProductCatalog refresh={refresh} setRefresh={setRefresh}/>
            </div>
            {/* unutuk list data */}
            <div className='bg-white h-full p-5 absolute right-0 top-0 w-[30%]'>
                <div className='mt-16'>
                  <ListProduk refresh={refresh}/>
                </div>
            </div>
         </div>
        <Footer/>
       </div>
    </>
  )
}

export default App
