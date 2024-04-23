import { Button } from "flowbite-react";
import { Modal } from "flowbite-react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getApiData, postApiData } from "../function/api";
import { useGlobalState } from "./globalState";

export const ModalComponents = ({
  openModal,
  setOpenModal,
  refresh,
  setRefresh,
}) => {
  const [data, setData] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataOrderProduct, setDataOrderProduct] = useState([]);
  const [dataQtyKeranjang, setDataQtyKeranjang] = useState(6.7);
  const [dataSelisihQty, setDataSelisihQty] = useState(0);
  const [dataJumlahPesanan, setDataJumlahPesanan] = useState(0);
  const [dataTimbanganBersih, setDataTimbanganBersih] = useState(0);
  const {dataType, changeDataType} = useGlobalState()
  const [dataBody, setDataBody] = useState({
    order_id: null,
    product_id: null,
    details: {
      basket_weight: dataQtyKeranjang,
      vehicle_no: "",
      qty_weighing: "",
      number_of_item: "",
    },
  });

  // Generate random qty_weighing every time openModal changes
  useEffect(() => {
    const generateRandomQty = () => {
      return Math.floor(Math.random() * 101).toString();
    };

    setDataBody((prevDataBody) => ({
      ...prevDataBody,
      details: {
        ...prevDataBody.details,
        qty_weighing: generateRandomQty(),
      },
    }));

    if(dataType === 'Karkas'){
      const getDataKarkas = async () => {
        try {
          const {data, status} = await getApiData('products?category_name=Karkas')
          if(status === 200) {
            const newData = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setDataProduct(newData);
          }
        } catch (error) {
          console.log(error);
        }
      }
      getDataKarkas()
    }else if(dataType === 'Sampingan'){
      const getDataSampingan = async () => {
        try {
          const {data, status} = await getApiData('products?category_name=Sampingan')
          if(status === 200) {
            const newData = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setDataProduct(newData);
          }
        } catch (error) {
          console.log(error);
        }
      }
      getDataSampingan()
    }
  }, [openModal]);

  useEffect(() => {
    const getData = async () => {
      try {
          if(dataType === 'Ayam'){
            const { status, data } = await getApiData("orders");
            if(status === 200){
              const newData = data.filter(item => item.vendor?.transaction_type === 'inbound').map((item) => ({
                value: item.id,
                label: item.kode_order,
              }));
              setData(() => newData);
            }
          }else if(dataType === 'Parting'){
            const { status, data } = await getApiData("orders");
            if(status === 200){
              const newData = data.filter(item => item.vendor?.transaction_type === 'outbound').map((item) => ({
                value: item.id,
                label: item.kode_order,
              }));
              setData(() => newData);
           }
          }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [dataType]);

  const handleChangeAndGetProduct = async (selectedOption) => {
    const orderId = selectedOption.value;
    setDataBody((prevDataBody) => ({
      ...prevDataBody,
      order_id: orderId,
    }));
    try {
      const { status, data } = await getApiData(`orders/product/${orderId}`);
      if (status === 200) {
        const newData = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setDataProduct(newData);
      }else if(status === 404){
        setDataProduct([]);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const { status, data } = await getApiData(`orders/${orderId}`);
      if (status === 200) {
        setDataOrderProduct(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "basket_weight") {
      setDataQtyKeranjang(value);
    }
    setDataBody((prevDataBody) => ({
      ...prevDataBody,
      details: {
        ...prevDataBody.details,
        [name]: value,
      },
    }));
  };

  const handleChangeForProduct = (selectedOption) => {
    const dataProduct = dataOrderProduct.find(
      (item) => item.id === selectedOption.value
    ); // Menggunakan item.value untuk membandingkan dengan selectedOption.value
    setDataSelisihQty(dataProduct?.selisih_quantity);
    setDataJumlahPesanan(dataProduct?.quantity_pesanan);
    setDataTimbanganBersih(dataProduct?.timbang_bersih);
    setDataBody((prevDataBody) => ({
      ...prevDataBody,
      product_id: selectedOption.value,
    }));
  };

  const handleCreate = async () => {
    try {
      const { data, status } = await postApiData("orders/weighing", dataBody);
      if (status === 201) {
        setRefresh(!refresh);
        setOpenModal(!openModal);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const modalBody = () => {
    if(dataType === 'Ayam'){
      return (
        <>
           <div>
              <p className="text-4xl font-medium mb-1">
                {dataBody.details.qty_weighing} kg{" "}
              </p>
              <p className="mb-5 mt-2 text-gray-700">
                <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
                <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
              </p>
              <div className=" grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3 col-span-2">
                  <label htmlFor="">Kode order</label>
                  <Select
                    name="kode-order"
                    onChange={handleChangeAndGetProduct}
                    options={data}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Nomor kendaran</label>
                  <input
                    name="vehicle_no"
                    onChange={handleChange}
                    placeholder="Nomor kendaraan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Produk</label>
                  <Select
                    onChange={(selectedOption) =>
                      handleChangeForProduct(selectedOption)
                    }
                    options={dataProduct}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah ekor</label>
                  <input
                    name="number_of_item"
                    onChange={handleChange}
                    placeholder="Jumlah ekor"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah Kg timbangan</label>
                  <input
                    disabled
                    name="qty_weighing"
                    value={dataBody.details.qty_weighing}
                    placeholder="Qty timbangan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah kg keranjang</label>
                  <select onChange={handleChange} className="rounded-md" name="basket_weight" id="">
                    <option value="6.7">6,7 kg</option>
                    <option value="7.8">7,8 kg</option>
                  </select>
                </div>
              </div>
            </div>
        </>
      )
    } else if(dataType === 'Karkas'){
      return (
        <>
           <div>
              <p className="text-4xl font-medium mb-1">
                {dataBody.details.qty_weighing} kg{" "}
              </p>
              <p className="mb-5 mt-2 text-gray-700">
                <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
                <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
              </p>
              <div className=" grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Produk</label>
                  <Select
                    onChange={(selectedOption) =>
                      handleChangeForProduct(selectedOption)
                    }
                    options={dataProduct}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah karkas</label>
                  <input
                    name="number_of_item"
                    onChange={handleChange}
                    placeholder="Jumlah karkas"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah Kg timbangan</label>
                  <input
                    disabled
                    name="qty_weighing"
                    value={dataBody.details.qty_weighing}
                    placeholder="Qty timbangan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah kg keranjang</label>
                  <select onChange={handleChange} className="rounded-md" name="basket_weight" id="">
                    <option value="6.7">6,7 kg</option>
                    <option value="7.8">7,8 kg</option>
                  </select>
                </div>
              </div>
            </div>
        </>
      )
    } else if(dataType === 'Parting'){
      return (
        <>
           <div>
              <p className="text-4xl font-medium mb-1">
                {dataBody.details.qty_weighing} kg{" "}
              </p>
              <p className="mb-5 mt-2 text-gray-700">
                <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
                <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
              </p>
              <div className=" grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3 col-span-2">
                  <label htmlFor="">Kode order</label>
                  <Select
                    name="kode-order"
                    onChange={handleChangeAndGetProduct}
                    options={data}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Nomor kendaran</label>
                  <input
                    name="vehicle_no"
                    onChange={handleChange}
                    placeholder="Nomor kendaraan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Produk</label>
                  <Select
                    onChange={(selectedOption) =>
                      handleChangeForProduct(selectedOption)
                    }
                    options={dataProduct}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah parting</label>
                  <input
                    name="number_of_item"
                    onChange={handleChange}
                    placeholder="Jumlah parting"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah Kg timbangan</label>
                  <input
                    disabled
                    name="qty_weighing"
                    value={dataBody.details.qty_weighing}
                    placeholder="Qty timbangan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah kg keranjang</label>
                  <select onChange={handleChange} className="rounded-md" name="basket_weight" id="">
                    <option value="6.7">6,7 kg</option>
                    <option value="7.8">7,8 kg</option>
                  </select>
                </div>
              </div>
            </div>
        </>
      )
    } else if(dataType === 'Sampingan'){
      return (
        <>
           <div>
              <p className="text-4xl font-medium mb-1">
                {dataBody.details.qty_weighing} kg{" "}
              </p>
              <p className="mb-5 mt-2 text-gray-700">
                <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
                <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
              </p>
              <div className=" grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Produk</label>
                  <Select
                    onChange={(selectedOption) =>
                      handleChangeForProduct(selectedOption)
                    }
                    options={dataProduct}
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah sampingan</label>
                  <input
                    name="number_of_item"
                    onChange={handleChange}
                    placeholder="Jumlah sampingan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah Kg timbangan</label>
                  <input
                    disabled
                    name="qty_weighing"
                    value={dataBody.details.qty_weighing}
                    placeholder="Qty timbangan"
                    className="rounded-md h-9"
                    type="text"
                  />
                </div>
  
                <div className="flex flex-col gap-3">
                  <label htmlFor="">Jumlah kg keranjang</label>
                  <select onChange={handleChange} className="rounded-md" name="basket_weight" id="">
                    <option value="6.7">6,7 kg</option>
                    <option value="7.8">7,8 kg</option>
                  </select>
                </div>
              </div>
            </div>
        </>
      )
    }
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Timbangan</Modal.Header>
        <Modal.Body>
          {modalBody()}
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: `#f95b12` }} onClick={handleCreate}>
            Save
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
