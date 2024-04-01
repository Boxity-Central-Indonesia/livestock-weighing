import { Table } from "flowbite-react";
import { getApiData } from "../function/api";
import { useState, useEffect } from "react";

export const TableComponents = ({refresh}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const { data, status } = await getApiData('orders/weighing/today');
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
            header: 'Code',
            key: 'code'
        },
        {
            header: 'Name',
            key: 'name'
        },
        {
            header: 'Status aktivitas',
            key: 'status_activities'
        },
        {
            header: 'Tipe aktivitas',
            key: 'activity_type'
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
                <Table.Body className="divide-y">
                    {data.map((item, rowIndex) => (
                        <Table.Row key={rowIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            {columns.map((column, colIndex) => (
                                <Table.Cell key={colIndex}>{item[column.key]}</Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
