import '../styles/globals.css'; // ✅ this must be first

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
