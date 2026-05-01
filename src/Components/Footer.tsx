import "../styles/Footer.css";
import Link from "next/link";
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import Image from "next/image";
import rtc from "../assets/images/Rtc.png";
import pm from '../assets/images/pixel-manic-logo.png'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footerInner'>
        <div className='topSection'>
          <div className='column'>
            <h3 className='columnHeading'>Quick Links</h3>
            <ul className='linkList'>
              <li><Link href="/" className='link'>Home</Link></li>
              <li><Link href="/about" className='link'>About</Link></li>
              <li><Link href="/services" className='link'>Services</Link></li>
              <li><Link href="/projects" className='link'>Projects</Link></li>
              <li><Link href="/contact" className='link'>Contact</Link></li>
            </ul>
          </div>

          <div className='column second-column'>
            <h3 className='columnHeading'>Contact Info</h3>
            <ul className='contactList'>
              <li className='contactItem'>
                <span className='contactLabel'>Email:</span>
                <a href="mailto:info@rtctiling.info" className='link'>
                  info@rtctiling.info
                </a>
              </li>
              <li className='contactItem'>
                <span className='contactLabel'>Phone:</span>
                <a href="tel:0415254236" className='link'>
                  0415 254 236
                </a>
              </li>
              <li className='contactItem'>
                <span className='contactLabel'>Address:</span>
                <span className="address">38 Clyde Street, cabramatta</span>
              </li>
            </ul>
          </div>

          <div className='rightColumn'>
            <div className='socialIcons'>
              <Link href="#" className='socialLink' aria-label="X (Twitter)">
                <RiTwitterXFill />
              </Link>
              <Link href="#" className='socialLink' aria-label="Facebook">
                <IoLogoFacebook />
              </Link>
              <Link href="#" className='socialLink' aria-label="Instagram">
                <FaInstagram />
              </Link>
            </div>

            <div className='footer-logo'>
              <Image
                src={rtc}
                alt="RTC Tiling & Waterproofing"
                width={250}
                height={180}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>

        <hr className='divider' />

        <div className='bottomBar'>
          <p className='copyright'>rtctiling © 2026 All Rights Reserved.</p>
          <Link href={"https://pixelmanic.dev/"} className='credit'>
            <span className='creditText'>Design &amp; Development</span>
              <Image
                src={pm}
                alt="Pm"
                width={44}
                height={44}
              />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;