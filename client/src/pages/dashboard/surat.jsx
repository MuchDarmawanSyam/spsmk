import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import {
  PlusCircleIcon
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEnvelopeOpen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingData from "@/widgets/layout/loading-data";
import axios from "axios";

export function Surat() {
  const [loading, setLoading] = useState(false);
  const [surat, setSurat] = useState([]);
  const [suratDitampilkan, setSuratDitampilkan] = useState("");
  const [searchQueries, setSearchQueries] = useState("");
  const [searchParams] = useState(["kodeSurat", "perihal", "tebusan", "tglSurat"]);
  const [openModal, setOpenModal] = useState(false);
  const [detailModal, setDetailModal] = useState([]); // index 0 simpan nomor surat, index 1 simpan uuid surat
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Membaca jenis form asal agar menampilkan surat sejenis
  useEffect(() => {
    if (state) {
      setSuratDitampilkan(state.jenisSurat);
    }else{
      navigate("/dashboard/home");
    }
  }, []);

  useEffect(() => {
      getSurat("http://localhost:5000/surat/"+suratDitampilkan);
  }, [suratDitampilkan, searchQueries]);

  const getSurat = async(endpoint) => {
    setLoading(true);
    const response = await axios.get(endpoint);
    setSurat(search(response.data));
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
    setDetailModal([e[0], e[1]]);
  }

  const deleteSurat = async(id) => {
    setLoading(true);
    setOpenModal(!openModal);
    
    if (suratDitampilkan == "masuk"){
      await axios.delete(`http://localhost:5000/surat/masuk/${id}`);
    }else{
      await axios.delete(`http://localhost:5000/surat/keluar/${id}`);
    }
    getSurat("http://localhost:5000/surat/"+suratDitampilkan);
    setLoading(false);
  }
  
  const kapitalHurufPertama = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="w-auto flex justify-end">
        <Tabs value={(state != null) ? state.jenisSurat : suratDitampilkan} className="w-1/3">
          <TabsHeader>
            <Tab value="masuk"
              onClick={() => setSuratDitampilkan("masuk")}
            >
              <FontAwesomeIcon icon={faEnvelope} className="-mt-1 mr-2 inline-block h-5 w-5" />
                Masuk
            </Tab>
            <Tab value="keluar"
              onClick={() => setSuratDitampilkan("keluar")}
            >
              <FontAwesomeIcon icon={faEnvelopeOpen} className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                Keluar
            </Tab>
          </TabsHeader>
        </Tabs>
      </div>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex">
            <Typography variant="h6" color="white" className="w-2/3 mt-2">
                  Lihat Data Surat {kapitalHurufPertama(suratDitampilkan)} 
                  {/* {state.jenisForm}  */}
            </Typography>
            <div className="w-1/3 flex justify-end">
              <div className="mr-auto md:mr-4 md:w-56 ml-10">
                <Input label={"Pencarian Surat " + kapitalHurufPertama(suratDitampilkan)} color="white" 
                  onChange={(e) => setSearchQueries(e.target.value)}
                />
              </div>
              <div className="mr-auto md:mr-4 md:w-56">
                <Link to="/dashboard/surat/tambah" state={{ jenisSurat: suratDitampilkan }}>
                  <IconButton ripple={true} className="rounded-full text-green-800" color="white" >
                    <PlusCircleIcon className="w-10 h-10"/>
                  </IconButton>
                </Link>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          { loading ? <LoadingData /> : (suratDitampilkan == "masuk") ? 
          
          // Surat Masuk
          (<div>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["No", "Nomor Surat", "Perihal", "Asal", "Tebusan", "Tanggal Surat", "Tanggal diterima", "Aksi"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-center"
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
                {surat.map((dataSurat, index) => (
                  <tr key={dataSurat.uuid} className="transition duration-300 ease-in-out hover:bg-gray-200">
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {index+1}.
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Link to={`/dashboard/surat/masuk/detail/${dataSurat.uuid}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold transition-colors hover:text-blue-900"
                          >
                            {dataSurat.kodeSurat}
                          </Typography>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {dataSurat.perihal}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {dataSurat.asal}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {dataSurat.tebusan}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {dataSurat.tglSurat}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="text-center">
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          Tanggal terima
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-blue-gray-50">
                    <div className="flex">
                      <Link to={`/dashboard/surat/masuk/edit/${dataSurat.uuid}`}>
                        <IconButton ripple={true} className="text-black ml-1" color="amber" >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </IconButton>
                      </Link>
                      <IconButton ripple={true} className="text-white ml-2 mr-1" color="red" 
                        onClick={() => handlerModal([dataSurat.kodeSurat, dataSurat.uuid])}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>)
          
          : 
          
          // Surat Keluar
          (<div>
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["No", "Nomor Surat", "Perihal", "Tujuan", "Tebusan", "Tanggal Surat", "Aksi"].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5 text-center"
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
                  {surat.map((dataSurat, index) => (
                    <tr key={dataSurat.uuid} className="transition duration-300 ease-in-out hover:bg-gray-200">
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {index+1}.
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Link to={`/dashboard/surat/keluar/detail/${dataSurat.uuid}`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold transition-colors hover:text-blue-900"
                            >
                              {dataSurat.kodeSurat}
                            </Typography>
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {dataSurat.perihal}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {dataSurat.tujuan}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {dataSurat.tebusan}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="text-center">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {dataSurat.tglSurat}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="border-b border-blue-gray-50">
                      <div className="flex">
                        <Link to={`/dashboard/surat/keluar/edit/${dataSurat.uuid}`}>
                          <IconButton ripple={true} className="text-black ml-1" color="amber" >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </IconButton>
                        </Link>
                        <IconButton ripple={true} className="text-white ml-2 mr-1" color="red" 
                          onClick={() => handlerModal([dataSurat.kodeSurat, dataSurat.uuid])}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Dialog Modal Konfirm Delete Surat */}
      <Dialog 
        open={openModal}
        handler={handlerModal}
        size="md"
      >
        <DialogHeader> Konfirmasi Hapus Data Surat {kapitalHurufPertama(suratDitampilkan)}. </DialogHeader>
        <DialogBody>
          <Typography>
            Tindakan ini akan menghapus semua data lampiran yang berkaitan dengan surat ini.
            (Nomor Surat: <b>{detailModal[0]}</b>). Anda Yakin ?
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
          <Button variant="gradient" color="red" onClick={() => deleteSurat(detailModal[1])}>
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Surat;