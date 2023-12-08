import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  EnvelopeOpenIcon,
  EnvelopeIcon
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import axios from "axios";

export function Surat() {
  const [loading, setLoading] = useState(false);
  const [surat, setSurat] = useState([]);
  const [suratDitampilkan, setSuratDitampilkan] = useState("masuk");
  const [searchQueries, setSearchQueries] = useState("");
  const [searchParams] = useState(["kodeSurat", "perihal", "tebusan", "tglSurat"]);

  useEffect(() => {
    if (suratDitampilkan == "masuk") {
      getSurat("http://localhost:5000/surat/masuk");
    }else{
      getSurat("http://localhost:5000/surat/keluar");
    }
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
        <Tabs value={suratDitampilkan} className="w-1/3">
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
            </Typography>
            <div className="w-1/3 flex justify-end">
              <div className="mr-auto md:mr-4 md:w-56">
                <Input label={"Pencarian Surat " + kapitalHurufPertama(suratDitampilkan)} color="white" 
                  onChange={(e) => setSearchQueries(e.target.value)}
                />
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
// Perbaiki logout ui dan modularisasi loading data
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
                  {index+1}
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
                  {index+1}
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

const LoadingData = () => (
  <div class="text-center">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>
  </div>
)

export default Surat;