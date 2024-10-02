import { Button } from "../ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
const Navbar = () => {
  return (
    <nav
      className="shadow-paper bg-white w-full z-10"
      style={{ position: "fixed", bottom: "0" }}
    >
      <div
        className="container  h-[70px] w-full flex flex-row 
      justify-center items-center"
      >
        <ul className="flex flex-row gap-10 w-full justify-center">
          <Link href="/" className="whitespace-nowrap">
            <div className="flex flex-col">
              <div className="mx-auto">
                <FontAwesomeIcon icon={faHome} className="w-7 h-7" />
              </div>
              Home
            </div>
          </Link>
          <Link href="/barcode-scanner" className="whitespace-nowrap">
            <div className="flex flex-col">
              <div className="mx-auto">
                <FontAwesomeIcon
                  icon={faBarcode}
                  className=" w-3 h-7 ml-2"
                  style={{ position: "absolute" }}
                />
                <FontAwesomeIcon icon={faExpand} className="w-7 h-7" />
              </div>
              Scan
            </div>
          </Link>
          <Link href="/dashboard" className="whitespace-nowrap">
            <div className="flex flex-col">
              <div className="mx-auto">
                <FontAwesomeIcon icon={faChartBar} className="w-7 h-7" />
              </div>
              Dashboard
            </div>
          </Link>
          <Link href="/history" className="whitespace-nowrap">
            <div className="flex flex-col">
              <div className="mx-auto">
                <FontAwesomeIcon icon={faBook} className="w-7 h-7" />
              </div>
              History
            </div>
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
