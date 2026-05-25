import "../styles/Footer.css";
import Link from "next/link";
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import Image from "next/image";
import rtc from "../assets/images/rtc-new-logo.jpeg";
import pm from '../assets/images/pixel-manic-logo.png'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footerInner'>
        <div className='topSection'>
          <div className='column'>
            <h3 className='columnHeading'>Why RTC</h3>
            <ul className='linkList'>
              <li className="lilink">✓ Family Owned Business</li>
              <li className="lilink">✓ 20+ Years Industry Experience</li>
              <li className="lilink">✓ NSW Wide Service</li>
              <li className="lilink">✓ Residential • Commercial • Industrial</li>
              <li className="lilink">✓ Licensed & Insured</li>
              <li className="lilink">✓ Workmanship Warranty Certificates Issued</li>
              <li className="lilink">✓ Up To 10-Year Warranty Coverage</li>
              <li className="lilink">✓ Quality Work Built To Last</li>
            </ul>
          </div>

          <div className='column second-column'>
            <h3 className='columnHeading'>Get in Touch</h3>
            <ul className='contactList'>
              <li className='contactItem'>
                <span className='contactLabel'>Email Us:</span>
                <a href="mailto:info@rtcprojects.info" className='link'>
                  info@rtcprojects.com.au
                </a>
              </li>
              <li className='contactItem'>
                <span className='contactLabel'>Phone:</span>
                <a href="tel:0480205289" className='link'>
                  0480 205 289
                </a>
              </li>
              <li className='contactItem'>
                <span className='contactLabel'>Address:</span>
                <p className="address">NSW Wide</p>
              </li>
            </ul>
          </div>

          <div className='rightColumn'>
            <div className='socialIcons'>
              <Link href="#" className='socialLink' target="_blank" aria-label="X (Twitter)">
                <RiTwitterXFill />
              </Link>
              <Link href="https://www.facebook.com/share/1HZZjL6FTy/?mibextid=wwXIfr" target="_blank" className='socialLink' aria-label="Facebook">
                <IoLogoFacebook />
              </Link>
              <Link href="#" className='socialLink' target="_blank" aria-label="Instagram">
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
          <Link href={"https://pixelmanic.dev/"} target="_blank" className='credit'>
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