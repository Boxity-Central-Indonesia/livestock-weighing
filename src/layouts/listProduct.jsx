// listProduk.jsx

import { TableComponents } from "./Tabel";

export const ListProduk = ({ refresh }) => {
  return (
    <>
      <div className="p-3">
        <h2 className="text-xl font-medium font-bold text-uppercase">
          Daftar data timbangan
        </h2>
        <hr className="mt-3" />
        <div className="mt-2">
          <TableComponents refresh={refresh} />
        </div>
      </div>
    </>
  );
};
