import "../styles/globals.css";
import 'bulma/css/bulma.min.css';

import _Head from "../components/Head";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <_Head />
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
