
const mongoose=require("mongoose")
function dbconnect() {
    mongoose.connect
    (
        process.env.MONGO_URL
    )
        .then(() => console.log("Database connected"))
        .catch(err => console.error("Connection error:", err));
}
module.exports=dbconnect;