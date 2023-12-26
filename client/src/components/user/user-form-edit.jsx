import {
    Avatar,
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
  import { Link, useParams, useNavigate } from "react-router-dom";
  import LoadingData from "@/widgets/layout/loading-data";
  import axios from "axios";

  export function FormEditUser() {
    // Setup
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState(true);
    const [errorMsg, setErrorMsg] = useState("Hanya ROLE user yang dapat diperbarui");
    const { id } = useParams();
    const navigate = useNavigate();

    // Form
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [url, setUrl] = useState("");
    const [photo, setPhoto] = useState("");

    // Validasi Password akun saya
    const [cPasswordSaya, setCPasswordSaya] = useState("");
    const [emailSaya, setEmailSaya] = useState("");
    const [validasiSaya, setValidasiSaya] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      const getUserById = async() => {
          try {
              const response = await axios.get(`http://localhost:5000/users/${id}`);
              setNama(response.data.nama);
              setEmail(response.data.email);
              setRole(response.data.role);
              setUrl(response.data.url);
              setPhoto(response.data.fotoprofil);
          } catch (error) {
              if (error.response) {
                  setAlertMsg(true);
                  setErrorMsg(error.response.data.msg);
              }
          }
      }
      getUserById();
      Me();
      setLoading(false);
    }, [id]);

    const updateUser = async() => {
      setLoading(true);
      try {
        await axios.patch(`http://localhost:5000/users/${id}`, {
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

    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <div className="flex">
              <Typography variant="h6" color="white" className="w-2/3 mt-2">
                    Form Edit User {role}
              </Typography>
              <div className="w-1/3 flex justify-end">
                <div className="md:mr-4 md:w-56 ml-24">
                </div>
                <div className="md:mr-4 md:w-56">
                  <IconButton ripple={true} className="rounded-full text-green-800" color="white" 
                    onClick={() => updateUser()}
                  disabled={
                    // Validasi Form, tdk boleh salah satu kosong
                    ((role == "") ||
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
              // Form Edit User
              (<div className="ml-10">
                    <form class="w-full max-w-lg">
                      <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3 mb-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                              Foto Profil
                          </label>
                          <Avatar src={url} alt={photo} size="xxl" variant="rounded"/>
                        </div>
                        <div class="w-full px-3 mb-6 mt-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-nomor-surat">
                            Nama Pengguna
                          </label>
                          <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-nomor-surat" type="text"
                            value={nama}
                            disabled={true}
                          />
                        </div>
                        <div class="w-full mt-6 px-3">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-asal-surat">
                            Email
                          </label>
                          <Input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-asal-surat" type="text"
                            value={email}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div class="flex flex-wrap -mx-3 mb-2">
                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-tanggal-terima">
                              Role Pengguna
                          </label>
                          <select variant="standard" label="Role Pengguna"
                            class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={e => setRole(e.target.value)}
                          >
                            <option value="petugas" selected={(role == "petugas") ? true : false}>Petugas</option>
                            <option value="admin" selected={(role == "admin") ? true : false}>Admin</option>
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
  
  export default FormEditUser;