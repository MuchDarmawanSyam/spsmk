import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Tabs,
    TabsHeader,
    Tab,
    Input,
    Alert,
    IconButton
  } from "@material-tailwind/react";
  import {
    EnvelopeOpenIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    StopCircleIcon
  } from "@heroicons/react/24/solid";
  import { useState, useEffect } from "react";
  import { Link, useLocation, useNavigate } from "react-router-dom";
  import LoadingData from "@/widgets/layout/loading-data";
  import axios from "axios";
  
  export function FormTambah() {
    // Setup
    const [loading, setLoading] = useState(false);
    const [suratDitampilkan, setSuratDitampilkan] = useState(""); // Nilai Default masuk, diset di layout navigation
    const [fromTable, setFromTable] = useState(true);
    const [alertMsg, setAlertMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { state } = useLocation();

    // Form
    const [nomorSurat, setNomorSurat] = useState("");
    const [perihal, setPerihal] = useState("");
    const [asal, setAsal] = useState("");
    const [tebusan, setTebusan] = useState("");
    const [tglSurat, setTglSurat] = useState("");
    const [tglDiterima, setTglDiterima] = useState("");
    const [tujuan, setTujuan] = useState("");

    // Set jenis form yg muncul berdasarkan asal aksesnya. Kembali jika akses form bukan dari dashboard/surat
    useEffect(() => {
      if (state) {
        setSuratDitampilkan(state.jenisSurat);
        setFromTable(false);
      } else {
        navigate("/dashboard/home");
      }
    }, []);
  
    const addSuratMasuk = async() => {
      setLoading(true);
      try {
        await axios.post("http://localhost:5000/surat/masuk",{
          kodeSurat: nomorSurat,
          perihalSurat: perihal,
          asalSurat: asal,
          tglSurat: tglSurat,
          tebusanSurat: tebusan
        });
        setLoading(false);
        navigate("/dashboard/surat", {
          state: { jenisSurat: "masuk", }
        });
      } catch (error) {
        setLoading(false);
        setAlertMsg(true);
        setErrorMsg(error.response.data.msg);
      }
    }
    
    const addSuratKeluar = async() => {
      setLoading(true);
      try {
        await axios.post("http://localhost:5000/surat/keluar",{
          kodeSurat: nomorSurat,
          perihalSurat: perihal,
          tujuanSurat: tujuan,
          tglSurat: tglSurat,
          tebusanSurat: tebusan
        });
        setLoading(false);
        navigate("/dashboard/surat", {
          state: { jenisSurat: "keluar", }
        });
      } catch (error) {
        setLoading(false);
        setAlertMsg(true);
        setErrorMsg(error.response.data.msg);
      }
    }

    const kapitalHurufPertama = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const resetForm = () => {
      setNomorSurat("");
      setTujuan("");
      setAsal("");
      setPerihal("");
      setTebusan("");
      setTglSurat("");
      setTglDiterima("");
    }

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <div className="w-auto flex justify-end">
          <Tabs value={fromTable ? state.jenisSurat : suratDitampilkan} className="w-1/3">
            <TabsHeader>
              <Tab value="masuk"
                onClick={() => setSuratDitampilkan("masuk")}
              >
                <EnvelopeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                  Masuk
              </Tab>
              <Tab value="keluar"
                onClick={() => setSuratDitampilkan("keluar")}
              >
                <EnvelopeOpenIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                  Keluar
              </Tab>
            </TabsHeader>
          </Tabs>
        </div>
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex">
              <Typography variant="h6" color="white" className="w-2/3 mt-2">
                    Form Tambah Surat {kapitalHurufPertama(suratDitampilkan)}
              </Typography>
              <div className="w-1/3 flex justify-end">
                <div className="md:mr-4 md:w-56 ml-24">
                  <IconButton ripple={true} className="rounded-full text-orange-900" color="white" onClick={() => resetForm()} >
                    <StopCircleIcon className="w-10 h-10"/>
                  </IconButton>
                </div>
                <div className="md:mr-4 md:w-56">
                  <IconButton ripple={true} className="rounded-full text-green-800" color="white" 
                    onClick={() => (suratDitampilkan == "masuk") ? addSuratMasuk() : addSuratKeluar()}
                  disabled={
                    // Validasi Form, tdk boleh salah satu kosong
                    (suratDitampilkan == "masuk") ?
                    ((nomorSurat == "") ||
                     (asal == "") ||
                     (perihal == "") ||
                     (tebusan == "") ||
                     (tglSurat == "")
                    ) :
                    ((nomorSurat == "") ||
                     (tujuan == "") ||
                     (perihal == "") ||
                     (tebusan == "") ||
                     (tglSurat == "")
                    )
                  }>
                    <CheckCircleIcon className="w-10 h-10"/>
                  </IconButton>
                </div>
                <div className="md:mr-4 md:w-56">
                  <Link to="/dashboard/surat"
                    state={{
                      jenisSurat: suratDitampilkan
                    }}
                  >
                    <IconButton ripple={true} className="rounded-full text-red-800" color="white" >
                      <XCircleIcon className="w-10 h-10"/>
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

            { loading ? <LoadingData /> : (suratDitampilkan == "masuk") ? 
            
            // Form Tambah Surat Masuk
            (<div className="ml-10">
              <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                      Nomor Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-nomor-surat" type="text" placeholder="SM/2023/10/29-07 "
                      value={nomorSurat}
                      onChange={(e) => setNomorSurat(e.target.value)}
                    />
                    {(nomorSurat != "") ? "" : (<p class="text-red-500 text-xs italic">Nomor Surat Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-asal-surat">
                      Asal Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-asal-surat" type="text" placeholder="Kantor A" 
                      value={asal}
                      onChange={(e) => setAsal(e.target.value)}
                    />
                    {(asal != "") ? "" : (<p class="text-red-500 text-xs italic">Asal Surat Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-perihal">
                      Perihal Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-perihal" type="text" placeholder="Undangan" 
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                    />
                    {(perihal != "") ? "" : (<p class="text-red-500 text-xs italic">Perihal Surat Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full px-3 mt-6">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tebusan">
                      Tebusan
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-tebusan" type="text" placeholder="Kepala Cabang" 
                      value={tebusan}
                      onChange={(e) => setTebusan(e.target.value)}
                    />
                    {(tebusan != "") ? "" : (<p class="text-red-500 text-xs italic">Tebusan Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-surat">
                        Tanggal Surat
                      </label>
                      <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-tanggal-surat" type="date" placeholder="10/12/2023" 
                        value={tglSurat}
                        onChange={(e) => setTglSurat(e.target.value)}
                      />
                      {(tglSurat != "") ? "" : (<p class="text-red-500 text-xs italic">Tanggal Surat Wajib Diisi.</p>)}
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-terima">
                        Tanggal Diterima
                      </label>
                      <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-tanggal-diterima" type="date" placeholder="11/12/2023" 
                        value={tglDiterima}
                        onChange={(e) => setTglDiterima(e.target.value)}
                      />
                      {(tglDiterima != "") ? "" : (<p class="text-red-500 text-xs italic">Tanggal Terima Wajib Diisi.</p>)}
                    </div>
                </div>
              </form>
            </div>)

            : 
            
            // Form Tambah Surat Keluar
            (<div className="ml-10">
              <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                      Nomor Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-nomor-surat" type="text" placeholder="SM/2023/10/29-07 "
                      value={nomorSurat}
                      onChange={(e) => setNomorSurat(e.target.value)}
                    />
                    {(nomorSurat != "") ? "" : (<p class="text-red-500 text-xs italic">Nomor Surat Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tujuan-surat">
                      Tujuan Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-tujuan-surat" type="text" placeholder="Kantor A" 
                      value={tujuan}
                      onChange={(e) => setTujuan(e.target.value)}
                    />
                    {(tujuan != "") ? "" : (<p class="text-red-500 text-xs italic">Tujuan Surat Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-perihal">
                      Perihal Surat
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-perihal" type="text" placeholder="Undangan" 
                      value={perihal}
                      onChange={(e) => setPerihal(e.target.value)}
                    />
                    {(perihal != "") ? "" : (<p class="text-red-500 text-xs italic">Perihal Surat Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full px-3 mt-6">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tebusan">
                      Tebusan
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-tebusan" type="text" placeholder="Kepala Cabang" 
                      value={tebusan}
                      onChange={(e) => setTebusan(e.target.value)}
                    />
                    {(tebusan != "") ? "" : (<p class="text-red-500 text-xs italic">Tebusan Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-surat">
                        Tanggal Surat
                      </label>
                      <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-tanggal-surat" type="date" placeholder="10/12/2023" 
                        value={tglSurat}
                        onChange={(e) => setTglSurat(e.target.value)}
                      />
                      {(tglSurat != "") ? "" : (<p class="text-red-500 text-xs italic">Tanggal Surat Wajib Diisi.</p>)}
                    </div>
                </div>
              </form>
            </div>)}
          </CardBody>
        </Card>
      </div>
    );
  }
  
  export default FormTambah;