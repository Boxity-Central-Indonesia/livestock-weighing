import { TableComponents } from "./Tabel";

export const ListProduk = ({ refresh }) => {
  return (
    <>
      <div>
        <h3 className="text-md font-medium font-bold text-uppercase">
          List data livestock weighing
        </h3>
        <hr className="mt-3" />
        <div className="mt-2">
          <TableComponents refresh={refresh} />
        </div>
      </div>
    </>
  );
};
