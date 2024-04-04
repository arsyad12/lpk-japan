import {
  VideoCameraIcon,
  BookOpenIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: VideoCameraIcon,
    title: "Live Streaming",
    value: "ZOOM",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: TrophyIcon,
    title: "Metode Belajar",
    value: "6",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: BookOpenIcon,
    title: "Bank Soal",
    value: "14.000+",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "gray",
    icon: UserGroupIcon,
    title: "Pengguna",
    value: "50.000+",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
