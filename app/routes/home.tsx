import Navbar from "~/components/layout/navbar";

export function meta({}: any) {
  return [
    { title: "Job Board" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Navbar />
    </div>
  );
}
