import { ModalComponents } from "./modal"
import { useEffect, useState } from "react"
import { getApiData } from "../function/api"

export const ProductCatalog = ({refresh, setRefresh}) => {
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        const getData = async () => {
            try {
                const {status, data} = await getApiData('product-categories')
                if(status === 200) {
                    setData(() => data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [])

    return (
        <>
            <ModalComponents openModal={openModal} setOpenModal={setOpenModal} refresh={refresh} setRefresh={setRefresh}/>
            <div className="grid grid-cols-4 gap-5">
                {data && data.map((item,index) => (
                    <div key={index} onClick={() => setOpenModal(true)} className="bg-white cursor-pointer hover:bg-gray-50 border rounded-md p-5 flex flex-col items-center justify-center gap-4">
                        {/* untuk icon */}
                        <div>
                        </div>
                        {/* untuk icon end */}
                        <div>
                            <p className="text-xl font-medium">{item.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}