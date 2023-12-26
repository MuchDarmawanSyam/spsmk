import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Input,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import {
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import LoadingData from "@/widgets/layout/loading-data";
import axios from "axios";


export function User() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [searchQueries, setSearchQueries] = useState("");
  const [searchParams] = useState(["nama", "email", "role"]);
  const [openModal, setOpenModal] = useState(false);
  const [detailModal, setDetailModal] = useState([]); // [nama, email, role, uuid]

  useEffect(() => {
    getUser();
  }, [searchQueries]);

  const getUser = async() => {
    setLoading(true);
    const response = await axios.get("http://localhost:5000/users");
    setUser(search(response.data));
    setLoading(false);
  }

  const search = (items) => {
    return items.filter((item) => {
        return searchParams.some((newItem) => {
            return (
                item[newItem]
                    .toString()
                    .toLowerCase()
                    .indexOf(searchQueries.toLowerCase()) > -1
            );
        });
    });
  }

  const handlerModal = (e) => {
    setOpenModal(!openModal);
    setDetailModal([e[0], e[1], e[2], e[3]]);
  }

  const deleteUser = async(id) => {
    setLoading(true);
    setOpenModal(!openModal);
    await axios.delete(`http://localhost:5000/users/${id}`);
    getUser();
    setLoading(false);
  }

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">  
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex">
              <Typography variant="h6" color="white" className="w-2/3 mt-2">
                    Lihat Data Pengguna
              </Typography>
              <div className="w-1/3 flex justify-end">
                <div className="mr-auto md:mr-4 md:w-56 ml-10">
                  <Input label={"Pencarian Surat Pengguna"} color="white" 
                    onChange={(e) => setSearchQueries(e.target.value)}
                  />
                </div>
                <div className="mr-auto md:mr-4 md:w-56">
                  <Link to="/dashboard/user/tambah">
                    <IconButton ripple={true} className="rounded-full text-green-800" color="white" >
                      <PlusCircleIcon className="w-10 h-10"/>
                    </IconButton>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["No", "Nama & Email", "Role", "Aksi"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                
                {loading ? <LoadingData /> : (user.map(
                  ({ uuid, nama, email, role, fotoprofil, url }, key) => {
                    const className = `py-3 px-5 ${
                      key === user.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={uuid}>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {key+1}.
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={url} alt={fotoprofil} size="sm" variant="rounded" />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {nama}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {role}
                          </Typography>
                        </td>
                        <td className={className}>
                            <div className="flex">
                              <Link to={`/dashboard/user/edit/${uuid}`}>
                                <IconButton ripple={true} className="text-black ml-1" color="amber" >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </IconButton>
                              </Link>
                              <IconButton ripple={true} className="text-white ml-2 mr-1" color="red" 
                                onClick={() => handlerModal([nama, email, role, uuid])}
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
        { /* Lanjut bikin fungsi add user, update user dan reset password user */}
        {/* Dialog Modal Konfirm Delete Surat */}
        <Dialog 
          open={openModal}
          handler={handlerModal}
          size="md"
        >
          <DialogHeader> Konfirmasi Hapus Data Pengguna. </DialogHeader>
          <DialogBody>
            <Typography>
              Tindakan ini akan menghapus semua data dengan rincian:<br></br>
              <b>
                Nama Pengguna  : {detailModal[0]}. <br></br>
                Email Pengguna : {detailModal[1]}. <br></br>
                Role Pengguna  : {detailModal[2]}.
              </b>
            </Typography>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              onClick={handlerModal}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="red" onClick={() => deleteUser(detailModal[3])}>
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
}

export default User;
