import { Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { getApiData } from "../function/api";

export function DisplayCards({
    setData,
    data
}) {

    const [hidden, setHidden] = useState(false)

      const handleClickCard = async (param) => {
        // disini nanti function untuk get data dari api
        try {
            const { status, data } = await getApiData("product-categories/" + param);
            if (status === 200) {
              setData(() => data);
              setHidden(true)
            }
          } catch (error) {
            console.log(error);
          }
      }  
    
  return (
    <>
    <div className={`${hidden ? `hidden` : ``}`}>
        <div modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
        <div className="h-full w-full absolute z-50 flex items-center justify-center">
            <div className="flex gap-3">
                <Card onClick={() => handleClickCard('ayam')} className="max-w-sm">
                    <div>
                        <img src="" alt="" />
                    </div>
                    <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                        Ayam
                    </h5>
                </Card>
                <Card onClick={() => handleClickCard('carcass')} className="max-w-sm">
                    <div>
                        <img src="" alt="" />
                    </div>
                    <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                        Karkas
                    </h5>
                </Card>
                <Card onClick={() => handleClickCard('parting')} className="max-w-sm">
                    <div>
                        <img src="" alt="" />
                    </div>
                    <h5 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
                        Parting
                    </h5>
                </Card>
            </div>
        </div>
    </div>
    </>
  );
}
