import UserHeader from "../../components/user/UserHeader";
import UserNavbar from "../../components/user/UserNavbar";
import "./Contact.css";

function Contact() {
  return (
    <div>
      <UserHeader/>
      <UserNavbar/>
    <div className="contact-page">
      <div className="contact-card">
        <h2>Contact Us</h2>
        <p className="contact-subtitle">
          We'd love to hear from you. Reach out for queries, orders, or support.
        </p>

        <div className="contact-grid">
          {/* LEFT: INFO */}
          <div className="contact-info">
            <h4>Zora Store</h4>
            <p>📍 D.No: 5-97-12, Lakshmipuram,</p>
            <p>Guntur, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@zorastore.com</p>

            <p className="contact-note">
              Our team usually responds within 24 hours.
            </p>
          </div>

          {/* RIGHT: FORM */}
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Contact;
