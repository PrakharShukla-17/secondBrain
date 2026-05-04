//step 1:
// schema and models::
// how my data is gonna look like in the database:
import mongoose,{model,Schema, Types} from "mongoose"

mongoose.connect("mongodb+srv://rishishukla17122003:r0snBdDZrjDUlWIY@cluster0.qgek25n.mongodb.net/brainly");
//dont forget to add scripts to pack.json to fasten upm your buil and run work

const contentTypes=["image","file","article","audio","video"]//extendable

const UserSchema=new Schema({
    username: {type:String, unique:true},
    password:String
})

//step 5: making contentSchema
const ContentSchema=new Schema({
    link: {type:String, required:true},
    type: {type:String, enum:contentTypes, required:true},
    title: {type:String,required:true },
    tags: [{type:Types.ObjectId, ref:'Tag'}],
    userId: {type:Types.ObjectId, ref:'User' ,required:true}
})

export const UserModel= model("User",UserSchema);
export const ContentModel= model("Content",ContentSchema);
//this is the new famncy export syntax ie compatible with this new fancy import syntax unlike the old require syntax
//cause as we know for older times.. we used to do module.exports{} and then put things to export inside it.