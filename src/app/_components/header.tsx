import { getId } from "@/lib/id";

export default async function Header() {
  const id = await getId();

  return <h1 className="text-2xl font-bold text-center">Hello {id}</h1>;
}
