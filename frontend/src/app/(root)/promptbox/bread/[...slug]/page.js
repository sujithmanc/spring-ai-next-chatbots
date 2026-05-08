import URLAppender from "./URLAppender";


export default async function Breadcrumbs({ params }) {

    const data = await params;

    return (
        <>
            <h1>Navigation</h1>
            <p>Post: {JSON.stringify(data, null, 4)}</p>
            <URLAppender />
        </>
    );
}