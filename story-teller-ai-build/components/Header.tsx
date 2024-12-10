import { BookOpen, FilePen } from "lucide-react"
import Link from "next/link"

function Header() {
  return (
    <header className="relative p-16 text-center">
        <Link href="/" >
            <h1 className="text-6xl font-black">Story Teller</h1>
            <div className="flex justify-center whitespace-nowrap space-x-5 text-3xl lg:text-5xl">
                <h2>Bringing new story</h2>
                <div className="relative">
                    <div className="absolute bg-purple-500 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></div>
                    <p className="relative text-white">To life!</p>
                </div>
            </div>
        </Link>

{/*______________________________________________________________________________________________________________________________________________________________ */}

        <div className="flex space-x-2  absolute -top-5 right-5 mt-10">
            <Link href="/">
                <FilePen
                    className="w-8 h-8 lg:h-10 lg:w-10 mx-auto text-purple-500  rounded-md hover:opacity-50 cursor-pointer"
                />
            </Link>
            <Link href="/stories">
                <BookOpen
                    className="w-8 h-8 lg:h-10 lg:w-10 mx-auto text-purple-500  rounded-md hover:opacity-50 cursor-pointer"
                />
            </Link>
        </div>
    </header>
  )
}

export default Header
