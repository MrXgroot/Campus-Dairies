import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import App from "./app/App";
import RootProviders from "./app/providers/RootProviders";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootProviders>
      <App />
    </RootProviders>
  </StrictMode>,
);
//   <StrictMode>
//     <GoogleOAuthProvider clientId="82302521950-cj4f02s66frsurts3goo8buabbq5nd92.apps.googleusercontent.com">
//       <Router>
//         <App />
//       </Router>
//     </GoogleOAuthProvider>
//   </StrictMode>
