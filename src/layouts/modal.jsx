import { Button } from "flowbite-react";
import { Modal } from "flowbite-react";
import Select from 'react-select';
import { useEffect, useState } from "react";
import { getApiData, postApiData } from "../function/api";

export const ModalComponents = ({
    openModal,
    setOpenModal,
    refresh,
    setRefresh
}) => {

    const [data, setData] = useState([]);
    const [dataProduct, setDataProduct] = useState([]);
    const [dataBody, setDataBody] = useState({
        order_id: null,
        product_id: null,
        details: {
            vehicle_no: "",
            qty_weighing: "",
            number_of_item: ""
        }
    });

    // Generate random qty_weighing every time openModal changes
    useEffect(() => {
        const generateRandomQty = () => {
            return Math.floor(Math.random() * 101).toString();
        };

        setDataBody(prevDataBody => ({
            ...prevDataBody,
            details: {
                ...prevDataBody.details,
                qty_weighing: generateRandomQty()
            }
        }));
    }, [openModal]);
    
    useEffect(() => {
        const getData = async () => {
            try {
                const {status, data} = await getApiData('orders')
                if(status === 200) {
                    const newData = data.map(item => ({
                        value: item.id,
                        label: item.kode_order
                    }));
                    setData(newData);
                }
            } catch (error) {
             console.log(error);   
            }
        };
        getData();
    }, []);

    const handleChangeAndGetProduct = async (selectedOption) => {
        const orderId = selectedOption.value;
        setDataBody(prevDataBody => ({
            ...prevDataBody,
            order_id: orderId
        }));
        try {
            const {status, data} = await getApiData(`orders/product/${orderId}`);
            if(status === 200){
                const newData = data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setDataProduct(newData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataBody(prevDataBody => ({
            ...prevDataBody,
            details: {
                ...prevDataBody.details,
                [name]: value
            }
        }));
    };

    const handleCreate = async () => {
        try {
            const {data, status} = await postApiData('orders/weighing', dataBody)
            if(status === 201){
                setRefresh(!refresh)
                setOpenModal(!openModal)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
             <Modal show={openModal} onClose={()=> setOpenModal(false)}>
                 <Modal.Header>Timbangan</Modal.Header>
                 <Modal.Body>
                     <div>
                        <p className="text-3xl font-medium mb-5">{dataBody.details.qty_weighing} kg</p>
                        <div className=" grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-3 col-span-2">
                                <label htmlFor="">Kode order</label>
                                <Select name="kode-order" onChange={handleChangeAndGetProduct} options={data} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="">Nomor kendaran</label>
                                <input name="vehicle_no" onChange={handleChange} placeholder="Nomor kendaraan" className="rounded-md h-9" type="text" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label htmlFor="">Produk</label>
                                <Select onChange={(selectedOption) => setDataBody(prevDataBody => ({...prevDataBody, product_id: selectedOption.value}))} options={dataProduct} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="">Qty timbangan</label>
                                <input disabled name="qty_weighing" value={dataBody.details.qty_weighing} placeholder="Qty timbangan" className="rounded-md h-9" type="text" />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="">Jumlah ekor</label>
                                <input name="number_of_item" onChange={handleChange} placeholder="Jumlah ekor" className="rounded-md h-9"type="text" />
                            </div>

                        </div>
                     </div>
                 </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={handleCreate}>Save</Button>
                     <Button color="gray" onClick={()=> setOpenModal(false)}>
                         Batal
                     </Button>
                 </Modal.Footer>
             </Modal>
        </>
    );
};
