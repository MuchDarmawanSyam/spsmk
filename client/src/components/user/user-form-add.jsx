import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    Alert,
    IconButton,
    Button
  } from "@material-tailwind/react";
  import {
    CheckCircleIcon,
    XCircleIcon,
    StopCircleIcon
  } from "@heroicons/react/24/solid";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faCheck } from "@fortawesome/free-solid-svg-icons";
  import { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import LoadingData from "@/widgets/layout/loading-data";
  import axios from "axios";
  
  export function FormTambahUser() {
    // Setup
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    // Form
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [role, setRole] = useState("");
    
    // Validasi Password akun saya
    const [cPasswordSaya, setCPasswordSaya] = useState("");
    const [emailSaya, setEmailSaya] = useState("");
    const [validasiSaya, setValidasiSaya] = useState(false);
  
    useEffect(() => {
      Me(); // Get data Email dan set
    }, []);

    const addUser = async() => {
      setLoading(true);
      try {
        await axios.post("http://localhost:5000/users",{
          nama: nama,
          email: email,
          password: password,
          cPassword: cPassword,
          role: role
        });
        setLoading(false);
        navigate("/dashboard/user");
      } catch (error) {
        setLoading(false);
        setAlertMsg(true);
        setErrorMsg(error.response.data.msg);
      }
    }

    const Me = async() => {
      const res = await axios.get('http://localhost:5000/me');
      setEmailSaya(res.data.email);
    }

    // Validasi sebelum add pengguna
    const confirmPass = async() => {
      setLoading(true);
      try {
        const apiReq = await axios.post("http://localhost:5000/users/validate",{
          email: emailSaya,
          cPasswordSaya: cPasswordSaya
        });
        setValidasiSaya(true);
        setAlertMsg(false);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setAlertMsg(true);
        setErrorMsg(error.response.data.msg);
      }
      
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
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex">
              <Typography variant="h6" color="white" className="w-2/3 mt-2">
                    Form Tambah Pengguna {email}
              </Typography>
              <div className="w-1/3 flex justify-end">
                <div className="md:mr-4 md:w-56 ml-24">
                  <IconButton ripple={true} className="rounded-full text-orange-900" color="white" onClick={() => resetForm()} >
                    <StopCircleIcon className="w-10 h-10"/>
                  </IconButton>
                </div>
                <div className="md:mr-4 md:w-56">
                  <IconButton ripple={true} className="rounded-full text-green-800" color="white" 
                    onClick={() => addUser()}
                  disabled={
                    // Validasi Form, tdk boleh salah satu kosong
                    ((nama == "") ||
                     (email == "") ||
                     (password == "") ||
                     (role == "") ||
                     (!validasiSaya)
                    )
                  }>
                    <CheckCircleIcon className="w-10 h-10"/>
                  </IconButton>
                </div>
                <div className="md:mr-4 md:w-56">
                  <Link to="/dashboard/user">
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

            { (loading && cPasswordSaya == "") ? <LoadingData /> :
            
            // Form Tambah Surat Masuk
            (<div className="ml-10">
              <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                      Nama Pengguna
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-nomor-surat" type="text" placeholder="cth: Much Darmawan Iriansyah Syam"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                    {(nama != "") ? "" : (<p class="text-red-500 text-xs italic">Nama Pengguna Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full mt-6 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-asal-surat">
                      Email
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-asal-surat" type="text" placeholder="cth: saya@gmail.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {(email != "") ? "" : (<p class="text-red-500 text-xs italic">Email Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                  <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-perihal">
                      Password
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-perihal" type="password" placeholder="Masukan Password Baru" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {(password != "") ? "" : (<p class="text-red-500 text-xs italic">Password Wajib Diisi.</p>)}
                  </div>
                  <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tebusan">
                      Konfirm Password
                    </label>
                    <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-tebusan" type="password" placeholder="Masukan Konfirmasi Password Baru" 
                      value={cPassword}
                      onChange={(e) => setCPassword(e.target.value)}
                    />
                    {(cPassword != "") ? "" : (<p class="text-red-500 text-xs italic">Konfirmasi Password Wajib Diisi.</p>)}
                  </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                  <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <select variant="standard" label="Role Pengguna"
                      class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                      selected={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="petugas">Petugas</option>
                      <option value="admin">Admin</option>
                    </select>
                      {(role != "") ? "" : (<p class="text-red-500 text-xs italic">Role Wajib Dipilih.</p>)}
                    </div>
                    <div class="w-full md:w-1/2 px-3 relative">
                      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-terima">
                        Konfirmasi Password Saya
                      </label>
                      <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password-konfirmasi" type="password" placeholder="Konfirmasi Password Saya"
                        value={cPasswordSaya}
                        onChange={(e) => setCPasswordSaya(e.target.value)}
                      />
                      <Button
                        size="sm"
                        color={!validasiSaya ? (cPasswordSaya == "") ? "gray" : "blue" : "green"}
                        disabled={!validasiSaya ? (cPasswordSaya == "" || loading) ? true : false : true}
                        className="!absolute -right-20 top-7 rounded"
                        onClick={() => confirmPass()}
                      >
                        {!validasiSaya ? loading ? <LoadingData /> : "Komfim" : <FontAwesomeIcon icon={faCheck} />}
                      </Button>
                      {(cPasswordSaya != "") ? "" : (<p class="text-red-500 text-xs italic">Konfirmasi Password Saya Wajib Diisi.</p>)}
                    </div>
                </div>
              </form>
            </div>)}
          </CardBody>
        </Card>
      </div>
    );
  }
  
  export default FormTambahUser;