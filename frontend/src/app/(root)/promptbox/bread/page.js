import MyBtn from "./MyBtn";
import StackUI from "./StackUI";

export default function Bread() {

    const myAct = async () => {
        "use server";
        console.log("My Button Clicked");
    }

    return (
        <>
            <h1>Bread Crumbs</h1>
            <StackUI myAct={myAct} />
            <MyBtn name="Click Me" onClick={myAct} />
        </>
    );
}

