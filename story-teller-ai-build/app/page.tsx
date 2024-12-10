import Image from "next/image";
import logo from "../images/logo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex-1 flex-col">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-500 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10">
          <Image
            src={logo}
            alt="Logo"
            className="mt-10 object-cover"
            height={200}
          />
          <Button asChild className="px-20 bg-purple-700 p-10 text-xl">
            <Link href="/stories">Explore Stories</Link>
          </Button>

        </div>

        <StoryWriter />
      </section>
    </main>
  );
}
