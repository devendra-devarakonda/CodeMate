import mongoose from 'mongoose';

function connection (){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Server is Connected");
    })

    .catch((err)=>{
        console.log(err);
    })
}

export default connection;