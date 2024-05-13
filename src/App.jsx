import "./App.css";
import { Navbar } from "./layouts/navbar";
import { ProductCatalog } from "./layouts/produkCatalog";
import { ListProduk } from "./layouts/listProduct";
import { useState } from "react";
import Footer from "./layouts/footer";
import { DisplayCards } from "./layouts/displayCards";
import { GlobalStateProvider } from "./layouts/globalState";
import { Spinner } from "./views/components/Spinner";

function App() {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(false)

  return (
    <>
      <GlobalStateProvider>
      <Spinner loading={loading}/>
      <Navbar setLoading={setLoading} />
      <DisplayCards data={data} setData={setData} setHidden={setHidden} hidden={hidden} setLoading={setLoading}/>
      <div className="pt-5">
        <div className="pt-16 px-5 pb-10">
          {/* untuk produk catalog */}
          <div className="border h-screen p-5 absolute left-0 top-0 w-[60%] overflow-hidden overflow-y-auto">
            <div className=" pb-16">
              <ProductCatalog refresh={refresh} setRefresh={setRefresh} data={data} setHidden={setHidden}/>
            </div>
          </div>
          {/* unutuk list data */}
          <div className="bg-white border h-screen p-5 absolute right-0 top-0 w-[40%] overflow-hidden overflow-scroll">
            <div className="pt-16 pb-10">
              <ListProduk refresh={refresh} setLoading={setLoading}/>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      </GlobalStateProvider>
    </>
  );
}

export default App;
