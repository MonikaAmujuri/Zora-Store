import "./VideoShopping.css";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

function VideoShopping() {
  return (
    <div className="video-shopping-page">
      {/* HERO */}
      <div className="video-hero">
        <h1>Video Shopping</h1>
        <p>
          Watch. Discover. Shop handcrafted sarees through our exclusive videos.
        </p>

        <div className="video-socials">
          <a
            href="https://www.instagram.com/zorawomenshopee?"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram /> Instagram
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp /> WhatsApp
          </a>

          <a
            href="https://youtube.com/@zorawomensshop4078?"
            target="_blank"
            rel="noreferrer"
          >
            <FaYoutube /> YouTube
          </a>
        </div>
      </div>

      {/* VIDEOS */}
      <div className="video-grid">
        {/* YouTube Videos */}
        <div className="video-card">
          <iframe
            src="https://youtu.be/10I0jfufI-A?"
            title="Zora Saree Collection"
            allowFullScreen
          ></iframe>
          <p>Pure Georgette Sarees</p>
        </div>

        <div className="video-card">
          <iframe
            src="https://youtu.be/3TP0-faXCCY?"
            title="Festive Sarees"
            allowFullScreen
          ></iframe>
          <p>Shigori Print Cotton Sarees</p>
        </div>

        {/* Instagram Reels (embed via iframe) */}
        <div className="video-card">
          <iframe
            src="https://www.instagram.com/reel/DTXJuFciYbK/?"
            title="Instagram Reel"
          ></iframe>
          <p>Style with elegant Crepe Silk Sarees</p>
        </div>

        <div className="video-card">
          <iframe
            src="https://www.instagram.com/reel/DTiEEzRDAxg/?"
            title="Instagram Reel"
          ></iframe>
          <p>Step into timeless beauty with our Tasar Silk Sarees</p>
        </div>

        <div className="video-card">
          <iframe
            src="https://www.instagram.com/reel/DTSTf0IDV-i/?"
            title="Instagram Reel"
          ></iframe>
          <p>pure elegance and tradition with our Banaras Mushru Sarees</p>
        </div>
      </div>
    </div>
  );
}

export default VideoShopping;
