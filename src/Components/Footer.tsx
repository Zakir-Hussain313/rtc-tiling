import "../styles/Footer.css";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import rtc from "../assets/images/rtc-logo.png";
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
              <li className="lilink">✓ Licensed & Insured</li>
              <li className="lilink">✓ Workmanship Warranty Certificates Issued</li>
              <li className="lilink">✓ Up To 10-Year Warranty Coverage</li>
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
            </ul>
          </div>

          <div className='rightColumn'>
            <div className='socialIcons'>
              <Link href="https://maps.app.goo.gl/G9GbPG4CrkNN9ZE19?g_st=aw" className='socialLink' target="_blank" aria-label="Google">
                <FaGoogle />
              </Link>
              <Link href="https://www.facebook.com/share/1HZZjL6FTy/?mibextid=wwXIfr" target="_blank" className='socialLink' aria-label="Facebook">
                <FaFacebook />
              </Link>
              <Link href="https://www.instagram.com/rtcprojectsau/" className='socialLink' target="_blank" aria-label="Instagram">
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
          <p className='copyright'>
            RTCprojects © {new Date().getFullYear()} All Rights Reserved.
          </p>

          <Link
            href={"https://pixelmanic.dev/"}
            target="_blank"
            className='credit'
          >
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