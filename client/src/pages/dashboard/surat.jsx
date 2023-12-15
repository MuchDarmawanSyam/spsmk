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
  Button,
} from "@material-tailwind/react";
import {
  EnvelopeOpenIcon,
  EnvelopeIcon,
  PlusCircleIcon
} from "@heroicons/react/24/solid";
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
          { loading ? <LoadingData /> : (suratDitampilkan == "masuk") ? <TabelSuratMasuk surat={surat} /> : <TabelSuratKeluar surat={surat} /> }
        </CardBody>
      </Card>
    </div>
  );
}

const TabelSuratMasuk = (props) => (
  <div>
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
        {props.surat.map((dataSurat, index) => (
          <tr key={dataSurat.uuid}>
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
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                >
                  {dataSurat.kodeSurat}
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
            <div>
              <Button className="ml-2">
                Edit
              </Button>
              <Button className="ml-2">
                Delete
              </Button>
            </div>
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const TabelSuratKeluar = (props) => (
  <div>
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
        {props.surat.map((dataSurat, index) => (
          <tr key={dataSurat.uuid}>
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
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold"
                >
                  {dataSurat.kodeSurat}
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
            <div>
              <Button className="ml-2">
                Edit
              </Button>
              <Button className="ml-2">
                Delete
              </Button>
            </div>
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default Surat;