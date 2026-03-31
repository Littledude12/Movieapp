import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <Navbar />
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Layout;