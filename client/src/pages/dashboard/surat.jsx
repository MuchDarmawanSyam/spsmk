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
  const [surat, setSurat] = useState([]);
  const [suratDitampilkan, setSuratDitampilkan] = useState("masuk");

  useEffect(() => {
    if (suratDitampilkan == "masuk") {
      getSurat("http://localhost:5000/surat/masuk");
    }else{
      getSurat("http://localhost:5000/surat/keluar");
    }
  }, [suratDitampilkan]);

  const getSurat = async(endpoint) => {
    const response = await axios.get(endpoint);
    setSurat(response.data);
  }

  const kapitalHurufPertama = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {
      }
      <div className="w-auto flex justify-end">
        <Tabs value={suratDitampilkan} className="w-1/3">
          <TabsHeader>
            <Tab value="masuk"
              onClick={() => setSuratDitampilkan("masuk")}
            >
              <EnvelopeOpenIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                Masuk
            </Tab>
            <Tab value="keluar"
              onClick={() => setSuratDitampilkan("keluar")}
            >
              <EnvelopeIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
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
                <Input label={"Pencarian Surat " + kapitalHurufPertama(suratDitampilkan)} color="white" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          { (suratDitampilkan == "masuk") ? <TabelSuratMasuk surat={surat} /> : <TabelSuratKeluar surat={surat} /> }
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

export default Surat;