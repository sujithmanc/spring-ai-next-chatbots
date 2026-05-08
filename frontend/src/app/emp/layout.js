import Timer from "./components/Timer";


export default function EmpLayout({ children }) {

    return (
        <>
            <Timer />
            {children}
        </>
    )
}