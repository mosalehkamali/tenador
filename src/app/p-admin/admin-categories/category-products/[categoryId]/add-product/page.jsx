export default async function addProduct({params}){
    const {categoryId}= await params
    return(
        <h1>
            {categoryId}
        </h1>
    )
}