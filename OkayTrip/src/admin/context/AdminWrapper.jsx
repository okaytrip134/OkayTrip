import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authContext";
import AppAdmin from "../AppAdmin";
import ErrorBoundary from "../components/ErrorBoundary";

const AdminAppWrapper = () => {
return (
    <BrowserRouter>
    <ErrorBoundary>
        <AuthProvider>
        <AppAdmin />
        </AuthProvider>
    </ErrorBoundary>
    </BrowserRouter>
);
};

export default AdminAppWrapper;