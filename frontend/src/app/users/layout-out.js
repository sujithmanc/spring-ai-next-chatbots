import NavBar from "@/features/users/ui/NavBar";


export default function RootLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
