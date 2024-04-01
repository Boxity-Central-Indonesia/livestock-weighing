import { TableComponents } from "./Tabel"



export const ListProduk = ({refresh}) => {
    return (
        <>
            <div>
                <h3 className="text-xl font-medium font-semibold">List Data</h3> 
                <div className="mt-5">
                    <TableComponents refresh={refresh} />
                </div>
            </div>
        </>
    )
}