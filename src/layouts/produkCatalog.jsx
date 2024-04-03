import { ModalComponents } from "./modal";
import { useEffect, useState } from "react";
import { getApiData } from "../function/api";

export const ProductCatalog = ({ refresh, setRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { status, data } = await getApiData("product-categories");
        if (status === 200) {
          setData(() => data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <ModalComponents
        openModal={openModal}
        setOpenModal={setOpenModal}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <h3 className="text-md font-medium font-bold">
        Pilih kategori barang yang ingin ditimbang
      </h3>
      <hr className="mt-3 mb-2" />
      <div className="grid grid-cols-4 gap-5">
        {data &&
          data.map((item, index) => (
            <div
              key={index}
              onClick={() => setOpenModal(true)}
              className="bg-white cursor-pointer hover:bg-gray-50 border rounded-md p-5 flex flex-col items-center justify-center gap-4"
            >
              {/* untuk icon */}
              <div></div>
              {/* untuk icon end */}
              <div>
                <p className="text-md font-medium text-center">{item.name}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
