import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { getApiData } from "../function/api";

export function DisplayCards({ setData, data }) {
  const [hidden, setHidden] = useState(false);

  const handleClickCard = async (param) => {
    // disini nanti function untuk get data dari api
    try {
      const { status, data } = await getApiData(
        "product-categories?name=" + param
      );
      if (status === 200) {
        setData(() => data);
        setHidden(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={`${hidden ? `hidden` : ``}`}>
        <div
          modalBackdrop=""
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
        ></div>
        <div className="absolute z-50 flex items-center justify-center w-full h-full">
          <div className="flex gap-2">
            <Card onClick={() => handleClickCard("Ayam")} className="max-w-sm">
              <div>
                <img
                  src="https://res.cloudinary.com/boxity-id/image/upload/v1713273620/ptDHKManufacturing/kategori/ayam_wobgug.png"
                  alt=""
                />
              </div>
              <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                Ayam
              </h5>
              <p className="text-muted">Produk produk tentang ayam hidup</p>
            </Card>
            <Card
              onClick={() => handleClickCard("Karkas")}
              className="max-w-sm"
            >
              <div>
                <img
                  src="https://res.cloudinary.com/boxity-id/image/upload/v1713273620/ptDHKManufacturing/kategori/dagingayamsegar_gq4pt8.png"
                  alt=""
                />
              </div>
              <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                Karkas
              </h5>
              <p className="text-muted">
                Daging ayam utuh tanpa kepala dan ceker yang sudah dibersihkan
                dari bulunya juga jeroannya.
              </p>
            </Card>
            <Card
              onClick={() => handleClickCard("Parting")}
              className="max-w-sm"
            >
              <div>
                <img
                  src="https://res.cloudinary.com/boxity-id/image/upload/v1713273622/ptDHKManufacturing/kategori/dagingayamolahan_jwq3mw.png"
                  alt=""
                />
              </div>
              <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                Parting
              </h5>
              <p className="text-muted">
                Berbagai produk potongan ayam, seperti sayap, dada, dan lain
                lain.
              </p>
            </Card>
            <Card
              onClick={() => handleClickCard("Sampingan")}
              className="max-w-sm"
            >
              <div>
                <img
                  src="https://res.cloudinary.com/boxity-id/image/upload/v1713817516/ptDHKManufacturing/kategori/produksammmpingan_wspxzl.png"
                  alt=""
                />
              </div>
              <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                Sampingan
              </h5>
              <p className="text-muted">
                Produk-produk sampingan yang dihasilkan selama pemrosesan ayam,
                seperti bulu ayam, darah ayam, dan tulang yang dapat digunakan
                untuk berbagai tujuan.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
