import app from "./app"
const port:any=process.env.PORT || 5000;

async function main() {
    try {
        app.listen(port,()=>{
            console.log(`the server is on port : ${port}`)

        })



    } catch (error) {
        console.log(`there is an error on starting the server `,error)
        
    }
    
}

main()