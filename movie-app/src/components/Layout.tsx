import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111111" }}>
      <Navbar />
      <div className="mt-5 px-4">{children}</div>
    </div>
  );
};

export default Layout;