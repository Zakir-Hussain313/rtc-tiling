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
  arrowImageSize?: string;
  border?: string;
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
  arrowImageSize,
  border,
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
        "--btn-arrow-image-size": arrowImageSize,
        "--btn-border": border,
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