import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { getApiData } from "../function/api";

export const TableComponents = ({ refresh, setLoading }) => {
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString)
      .toLocaleDateString("id-ID", options)
      .replace(",", "");
  };

  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await getApiData("orders/weighing/today");
        if (status === 200) {
          const grouped = groupByKodeOrder(data);
          setGroupedData(grouped);
          setLoading(true)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [refresh]);

  const groupByKodeOrder = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const kodeOrder = item.kode_order;
      if (!grouped[kodeOrder]) {
        grouped[kodeOrder] = {
          tanggal: item.created_at, // Menambahkan tanggal ke objek grup
          items: [],
        };
      }
      grouped[kodeOrder].items.push(item);
    });
    return grouped;
  };

  const columns = [
    {
      header: "Tanggal",
      key: "created_at",
      align: "left",
      width: "300px",
      render: (item) => formatDate(item.created_at),
    },
    {
      header: "Produk",
      key: "name",
      width: "200px",
      align: "start",
    },
    {
      header: "Berat Timbang",
      key: "details",
      align: "right",
      width: "230px",
      render: (item) => {
        const details = JSON.parse(item.details);
        return `${details.qty_weighing} ${details.noa_weighing}`;
      },
    },
    {
      header: "Jumlah",
      key: "details",
      align: "right",
      width: "150px",
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
            <Table.HeadCell className="table-cell" key={index}>
              {column.header}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y divide-x">
          {Object.entries(groupedData).map(([kodeOrder, group], index) => (
            <React.Fragment key={index}>
              <Table.Row key={index} className="bg-gray-300 font-medium">
                <Table.Cell className="table-cell" colSpan={columns.length}>
                  Kode Order: {kodeOrder}
                </Table.Cell>
              </Table.Row>
              {group.items.map((item, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  className="bg-white capitalize dark:border-gray-700 dark:bg-gray-800"
                >
                  {columns.map((column, colIndex) => (
                    <Table.Cell
                      className="table-cell"
                      key={colIndex}
                      align={column.align}
                      width={column.width}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
