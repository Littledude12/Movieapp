import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routing/AppRouting";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;