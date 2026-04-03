import Link from "next/link";
import Image from "next/image";
import arrow from "../assets/icons/Arrow.svg";
import "../styles/Mainbutton.css";

type MainbuttonProps = {
  data: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  arrowColor?: string;
  href?: string;
  padding?: string;
  arrowSize?: string;
};

function Mainbutton({
  data,
  backgroundColor,
  textColor,
  fontSize,
  arrowColor,
  href = "",
  padding,
  arrowSize,
}: MainbuttonProps) {
  return (
    <Link
      href={href}
      className="main-button"
      style={{
        "--btn-bg": backgroundColor,
        "--btn-color": textColor,
        "--btn-font-size": fontSize,
        "--btn-padding": padding,
        "--btn-arrow-bg": arrowColor,
        "--btn-arrow-size": arrowSize,
      } as React.CSSProperties}
    >
      {data}
      <span className="arrow">
        <span className="arrow-inner">
          <Image src={arrow} alt="arrow" />
        </span>
      </span>
    </Link>
  );
}

export default Mainbutton;