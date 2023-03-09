import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { CSSReset } from '@chakra-ui/react';
import '../styles/globals.css';

// theme if required
const theme = extendTheme({});
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      {/* usercontextProvider */}
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
