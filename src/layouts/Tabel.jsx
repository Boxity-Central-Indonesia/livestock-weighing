import { Table } from "flowbite-react";
import { getApiData } from "../function/api";
import { useState, useEffect } from "react";

export const TableComponents = ({ refresh }) => {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data, status } = await getApiData("orders/weighing/today");
        if (status === 200) {
          setData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [refresh]);

  const columns = [
    {
      header: "Tanggal",
      key: "created_at",
      render: (item) => formatDate(item.created_at),
    },
    {
      header: "Kode Order",
      key: "kode_order",
    },
    {
      header: "Produk",
      key: "name",
    },
    {
      header: "Berat Ditimbang",
      key: "details",
      render: (item) => {
        const details = JSON.parse(item.details);
        return `${details.qty_weighing} ${details.noa_weighing}`;
      },
    },
    {
      header: "Jumlah Ekor",
      key: "details",
      render: (item) => {
        const details = JSON.parse(item.details);
        return `${details.number_of_item} ${details.noa_numberofitem}`;
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table striped>
        <Table.Head>
          {columns.map((column, index) => (
            <Table.HeadCell key={index}>{column.header}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y divide-x">
          {data.map((item, rowIndex) => (
            <Table.Row
              key={rowIndex}
              className="bg-white capitalize dark:border-gray-700 dark:bg-gray-800"
            >
              {columns.map((column, colIndex) => (
                <Table.Cell key={colIndex}>
                  {column.render ? column.render(item) : item[column.key]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
