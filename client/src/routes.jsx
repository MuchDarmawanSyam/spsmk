import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { Home, User, Lampiran, Laporan, Surat} from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "kelola surat",
        path: "/surat",
        element: <Surat />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "kelola lampiran",
        path: "/lampiran",
        element: <Lampiran />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "kelola user",
        path: "/user",
        element: <User />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "kelola laporan",
        path: "/laporan",
        element: <Laporan />,
      },
    ],
  },
];

export default routes;
