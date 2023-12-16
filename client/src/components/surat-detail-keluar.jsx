import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Alert,
    IconButton
  } from "@material-tailwind/react";
  import {
    PencilSquareIcon,
    TrashIcon,
    ListBulletIcon
  } from "@heroicons/react/24/solid";
  import { useState, useEffect } from "react";
  import { Link, useParams } from "react-router-dom";
  import LoadingData from "@/widgets/layout/loading-data";
  import axios from "axios";
  
  export function DetailSuratKeluar() {
    // Setup
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { id } = useParams();

    // Data Surat Keluar
    const [nomorSurat, setNomorSurat] = useState("");
    const [perihal, setPerihal] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [tebusan, setTebusan] = useState("");
    const [tglSurat, setTglSurat] = useState("");
    const [tglDiterima, setTglDiterima] = useState("");
    const [ditambahkanOleh, setDitambahkanOleh] = useState("");

    // Set jenis form yg muncul berdasarkan asal aksesnya. Kembali jika akses form bukan dari dashboard/surat
    useEffect(() => {
        setLoading(true);
        const getProductById = async() => {
            try {
                const response = await axios.get(`http://localhost:5000/surat/keluar/${id}`);
                setNomorSurat(response.data.kodeSurat);
                setTujuan(response.data.tujuan);
                setPerihal(response.data.perihal);
                setTebusan(response.data.tebusan);
                setTglSurat(response.data.tglSurat);
                setTglDiterima(response.data.tglSurat); // Coba Pake Data Created At
                setDitambahkanOleh(response.data.user.nama);
            } catch (error) {
                if (error.response) {
                    setAlertMsg(true);
                    setErrorMsg(error.response.data.msg);
                }
            }
        }
        getProductById();
        setLoading(false);
    }, [id]);

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex">
              <Typography variant="h6" color="white" className="w-2/3 mt-2">
                    Lihat Detail Surat Keluar
              </Typography>
              <div className="w-1/3 flex justify-end">
                <div className="md:mr-4 md:w-56">
                  <Link to="/dashboard/surat"
                    state={{
                      jenisSurat: "keluar"
                    }}
                  >
                    <IconButton ripple={true} className="rounded-full text-blue-800" color="white" >
                      <ListBulletIcon className="w-10 h-10"/>
                    </IconButton>
                  </Link>
                </div>
                <div className="md:mr-4 md:w-56"> 
                  <IconButton ripple={true} className="rounded-full text-yellow-800" color="white" 
                    >
                    <PencilSquareIcon className="w-10 h-10"/>
                  </IconButton>
                </div>
                <div className="md:mr-4 md:w-56">
                  <Link to="/dashboard/surat"
                    state={{
                      jenisSurat: "masuk"
                    }}
                  >
                    <IconButton ripple={true} className="rounded-full text-red-800" color="white" >
                      <TrashIcon className="w-10 h-10"/>
                    </IconButton>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            { alertMsg ? 
                <Alert open={alertMsg} onClose={() => setAlertMsg(false)} className="w-2/3 mb-8 xl:ml-40 md:ml-36 sm:ml-24">
                  {errorMsg}
                </Alert> : "" }
            
            { loading ? <LoadingData /> :
            
            // Lihat Detail Surat Keluar
            (<div className="ml-10">
              <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-16">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                      Nomor Surat
                    </label>
                        {nomorSurat}
                  </div>
                  <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-asal-surat">
                      Tujuan Surat
                    </label>
                        {tujuan}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-16">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-perihal">
                      Perihal Surat
                    </label>
                        {perihal}
                  </div>
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tebusan">
                      Tebusan
                    </label>
                        {tebusan}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-16">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-surat">
                        Tanggal Surat
                    </label>
                        {tglSurat}
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-terima">
                        Tanggal Diterima
                      </label>
                        {tglDiterima}
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-surat">
                        Ditambahkan Oleh
                    </label>
                        {ditambahkanOleh}
                    </div>
                </div>
              </form>
            </div>)}
          </CardBody>
        </Card>
      </div>
    );
  }
  
  export default DetailSuratKeluar;