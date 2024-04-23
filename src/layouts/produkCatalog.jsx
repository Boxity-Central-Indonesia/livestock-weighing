import { ModalComponents } from "./modal";
import { useEffect, useState } from "react";
import { getApiData } from "../function/api";

export const ProductCatalog = ({ refresh, setRefresh, data, setHidden }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="">
        <ModalComponents
          openModal={openModal}
          setOpenModal={setOpenModal}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <button onClick={() => setHidden(false)} className="bg-[#f95b12] px-5 py-2 rounded-md text-white mt-20">
          Pilih tipe
        </button>
        <h2 className="text-xl font-medium font-bold mt-5">
          Pilih kategori barang yang ingin ditimbang
        </h2>
        <div className="grid grid-cols-4 gap-5 mt-5">
          {data &&
            data.map((item, index) => (
              <div
                key={index}
                onClick={() => setOpenModal(true)}
                className="bg-white cursor-pointer hover:bg-gray-50 border rounded-md p-5 flex flex-col items-center justify-center gap-4"
              >
                {/* untuk icon */}
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="imgResponsive"
                  />
                </div>
                {/* untuk icon end */}
                <div>
                  <p className="text-md font-medium text-center">{item.name}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
