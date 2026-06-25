import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config"
const port=config.port;

async function main() {
    try {
        // await prisma.$connect()
        console.log("Connect to the database successfully")
        app.listen(port,()=>{
            console.log(`the server is running on port : ${port}`)

        })



    } catch (error) {
        console.log(`there is an error on starting the server `,error)
        // await prisma.$disconnect()
        process.exit(1)
        
    }
    
}

main()