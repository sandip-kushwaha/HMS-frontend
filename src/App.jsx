import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <AppRoutes />
      <ToastContainer
      position= "top-right"
      autoClose= {2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;