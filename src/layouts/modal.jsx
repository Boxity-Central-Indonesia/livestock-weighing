import { Button } from "flowbite-react";
import { Modal } from "flowbite-react";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getApiData, postApiData } from "../function/api";
import { useGlobalState } from "./globalState";
import { timbangan } from "../function/timbangan";

export const ModalComponents = ({
  openModal,
  setOpenModal,
  refresh,
  setRefresh,
}) => {
  const [dataTimbangan, setDataTimbangan] = useState(timbangan())
  const [data, setData] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataOrderProduct, setDataOrderProduct] = useState([]);
  const [dataQtyKeranjang, setDataQtyKeranjang] = useState(6.7);
  const [dataSelisihQty, setDataSelisihQty] = useState(0);
  const [dataJumlahPesanan, setDataJumlahPesanan] = useState(0);
  const [dataTimbanganBersih, setDataTimbanganBersih] = useState(0);
  const { dataType, changeDataType } = useGlobalState();
  const [dataBody, setDataBody] = useState();
  const [dataJumlahItem, setDataJumlahItem] = useState(dataTimbangan)

  useEffect(() => {
    setDataTimbangan(timbangan())
    setDataJumlahItem(dataTimbangan)
    if (dataType === "Ayam") {
      setDataBody({
        order_id: null,
        product_id: null,
        details: {
          type_of_item: 'Ayam',
          qty_ayam_mati: "",
          qty_ayam_basah: "",
          basket_weight: dataQtyKeranjang,
          vehicle_no: "",
          qty_weighing: dataTimbangan,
          number_of_item: "",
        },
      });
    } else if (dataType === "Karkas") {
      setDataBody({
        // order_id: null,
        product_id: null,
        details: {
          type_of_item: "carcass",
          basket_weight: dataQtyKeranjang,
          // vehicle_no: "",
          qty_weighing: "",
          number_of_item: "",
        },
      });
      const getDataKarkas = async () => {
        try {
          const { data, status } = await getApiData(
            "products?category_name=Karkas"
          );
          if (status === 200) {
            const newData = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setDataProduct(newData);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getDataKarkas();
    } else if (dataType === "Parting") {
      setDataBody({
        order_id: null,
        product_id: null,
        details: {
          type_of_item: "Parting",
          basket_weight: dataQtyKeranjang,
          vehicle_no: "",
          qty_weighing: "",
          number_of_item: "",
        },
      });
      const getDataKarkas = async () => {
        try {
          const { data, status } = await getApiData(
            "products?category_name=Parting"
          );
          if (status === 200) {
            const newData = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setDataProduct(newData);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getDataKarkas();
    } else if (dataType === "Sampingan") {
      setDataBody({
        // order_id: null,
        product_id: null,
        details: {
          type_of_item: "Sampingan",
          basket_weight: dataQtyKeranjang,
          // vehicle_no: "",
          qty_weighing: "",
          number_of_item: "",
        },
      });
      const getDataSampingan = async () => {
        try {
          const { data, status } = await getApiData(
            "products?category_name=Sampingan"
          );
          if (status === 200) {
            const newData = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setDataProduct(newData);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getDataSampingan();
    }

    setDataBody((prevDataBody) => ({
      ...prevDataBody,
      details: {
        ...prevDataBody?.details,
        qty_weighing: dataTimbangan,
        // number_of_item: dataJumlahItem,
      },
    }));
  }, [openModal]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (dataType === "Ayam") {
          const { status, data } = await getApiData("orders");
          if (status === 200) {
            const newData = data
              .filter((item) => item.vendor?.transaction_type === "inbound")
              .map((item) => ({
                value: item.id,
                label: item.kode_order,
              }));
            setData(() => newData);
          }
        } else if (dataType === "Parting") {
          const { status, data } = await getApiData("orders");
          if (status === 200) {
            const newData = data
              .filter((item) => item.vendor?.transaction_type === "outbound")
              .map((item) => ({
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
      } else if (status === 404) {
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
      setDataJumlahItem(dataTimbangan)
    }
    if(name === 'number_of_item'){
      setDataJumlahItem(value)
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
      if (dataType === "Ayam" || dataType === "Parting") {
        const { data, status } = await postApiData("orders/weighing", dataBody);
        if (status === 201) {
          setRefresh(!refresh);
          setOpenModal(!openModal);
        }
      } else if (dataType === "Karkas") {
        const { data, status } = await postApiData(
          "orders/weighing/exordered",
          dataBody
        );
        if (status === 201) {
          setRefresh(!refresh);
          setOpenModal(!openModal);
        }
      } else if (dataType === "Sampingan") {
        const { data, status } = await postApiData(
          "orders/weighing/exordered",
          dataBody
        );
        if (status === 201) {
          setRefresh(!refresh);
          setOpenModal(!openModal);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const modalBody = () => {
    if (dataType === "Ayam") {
      return (
        <>
          <div>
            <p className="mb-1 text-4xl font-medium">
              {dataJumlahItem} kg{" "}
            </p>
            <p className="mt-2 mb-5 text-gray-700">
              <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
              <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
            </p>
            <div className="grid grid-cols-2 gap-5 ">
              <div className="flex flex-col col-span-2 gap-3">
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
                  name="qty_weighing"
                  value={dataBody?.details?.qty_weighing}
                  placeholder="Qty timbangan"
                  className="rounded-md h-9"
                  type="text"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah ayam mati</label>
                <input
                  name="qty_ayam_mati"
                  onChange={handleChange}
                  placeholder="Jumlah ayam mati"
                  className="rounded-md h-9"
                  type="number"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah ayam basah</label>
                <input
                  name="qty_ayam_basah"
                  onChange={handleChange}
                  placeholder="Jumlah ayam basah"
                  className="rounded-md h-9"
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah kg keranjang</label>
                <select
                  onChange={handleChange}
                  className="rounded-md"
                  name="basket_weight"
                  id=""
                >
                  <option value="6.7">6,7 kg</option>
                  <option value="7.8">7,8 kg</option>
                </select>
              </div>
            </div>
          </div>
        </>
      );
    } else if (dataType === "Karkas") {
      return (
        <>
          <div>
            <p className="mb-1 text-4xl font-medium">
              {dataJumlahItem} kg{" "}
            </p>
            <p className="mt-2 mb-5 text-gray-700"></p>
            <div className="grid grid-cols-2 gap-5 ">
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
                  name="qty_weighing"
                  value={dataBody.details.qty_weighing}
                  placeholder="Qty timbangan"
                  className="rounded-md h-9"
                  type="text"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah kg keranjang</label>
                <select
                  onChange={handleChange}
                  className="rounded-md"
                  name="basket_weight"
                  id=""
                >
                  <option value="6.7">6,7 kg</option>
                  <option value="7.8">7,8 kg</option>
                </select>
              </div>
            </div>
          </div>
        </>
      );
    } else if (dataType === "Parting") {
      return (
        <>
          <div>
            <p className="mb-1 text-4xl font-medium">
              {dataJumlahItem} kg{" "}
            </p>
            <p className="mt-2 mb-5 text-gray-700">
              <b>Jumlah Pesanan:</b> {dataJumlahPesanan} kg <br />
              <b>Selisih timbangan:</b> {dataSelisihQty} kg <br />
            </p>
            <div className="grid grid-cols-2 gap-5 ">
              <div className="flex flex-col col-span-2 gap-3">
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
                  name="qty_weighing"
                  value={dataBody.details.qty_weighing}
                  placeholder="Qty timbangan"
                  className="rounded-md h-9"
                  type="text"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah kg keranjang</label>
                <select
                  onChange={handleChange}
                  className="rounded-md"
                  name="basket_weight"
                  id=""
                >
                  <option value="6.7">6,7 kg</option>
                  <option value="7.8">7,8 kg</option>
                </select>
              </div>
            </div>
          </div>
        </>
      );
    } else if (dataType === "Sampingan") {
      return (
        <>
          <div>
            <p className="mb-1 text-4xl font-medium">
              {dataJumlahItem} kg{" "}
            </p>
            <p className="mt-2 mb-5 text-gray-700"></p>
            <div className="grid grid-cols-2 gap-5 ">
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
                  name="qty_weighing"
                  value={dataBody.details.qty_weighing}
                  placeholder="Qty timbangan"
                  className="rounded-md h-9"
                  type="text"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="">Jumlah kg keranjang</label>
                <select
                  onChange={handleChange}
                  className="rounded-md"
                  name="basket_weight"
                  id=""
                >
                  <option value="6.7">6,7 kg</option>
                  <option value="7.8">7,8 kg</option>
                </select>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Timbangan</Modal.Header>
        <Modal.Body>{modalBody()}</Modal.Body>
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
