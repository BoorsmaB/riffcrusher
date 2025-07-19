import React, { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { Helmet } from "react-helmet"; // ✅ Import Helmet
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Initialize Formspree form handler with your form ID
  const [state, handleSubmit] = useForm("xkgbeqvj");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Wrapper to sync formData with Formspree handleSubmit
  const onSubmit = (e) => {
    e.preventDefault();

    // Use Formspree's handleSubmit directly
    handleSubmit(e).then(() => {
      if (state.succeeded) {
        // Clear local form state on success
        setFormData({ name: "", email: "", message: "" });
      }
    });
  };

  if (state.succeeded) {
    return (
      <div className="contacts-container">
        <Helmet>
          <title>
            Contact Us | Jovanaar - Reach Out for Metal Music, Reviews & More
          </title>
          <meta
            name="description"
            content="Suggestions? Or want to get in touch with us to be reviewed? Check out this page."
          />
          <meta property="og:title" content="Contact Us" />
          <meta
            property="og:description"
            content="Suggestions? Or want to get in touch with us to be reviewed? Check out this page."
          />
          <meta
            property="og:url"
            content="https://www.riffcrusher.com/contact"
          />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        <h1>Contact</h1>
        <p>Thanks for your message! We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="contacts-container">
      <Helmet>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Suggestions? Or want to get in touch with us to be reviewed? Check out this page."
        />
        <meta property="og:title" content="Contact Us" />
        <meta
          property="og:description"
          content="Suggestions? Or want to get in touch with us to be reviewed? Check out this page."
        />
        <meta property="og:url" content="https://www.riffcrusher.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h1>Contact</h1>
      <p>
        Do you have a question? A suggestion? Or perhaps you want to write for
        us?
      </p>
      <p>
        Want us to review your band? Send an E-mail to Riffcrusher666@gmail.com
        either including a direct link to Spotify, Bandcamp or other platform.
        Or include the media files within the mail. Please include as much info
        as possible including your band logo and album cover.
      </p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {/* No ValidationError here because Formspree doesn't validate 'name' */}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </div>
        <button type="submit" disabled={state.submitting}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;
