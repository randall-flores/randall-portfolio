// framer-motion's DOM animation feature bundle, isolated so LazyMotion can
// pull it in as an async chunk after hydration instead of shipping it in the
// critical-path bundle.
export { domAnimation as default } from "framer-motion";
