const mongoose = require('mongoose');

let parcelSchemaJSON = {
    _id: mongoose.Schema.Types.ObjectId,
    sender: {type: String}, 
    address: {type: String},
    weight: {type: Number, min: [0, "Weight must be a positive value"]}, 
    fragile: {type: Boolean}, 

}

// makes every field required
for (let attr in parcelSchemaJSON){
    parcelSchemaJSON[attr]["required"] = true;
}

let parcelSchema = mongoose.Schema(parcelSchemaJSON);

// console.log(parcelSchemaJSON);

module.exports = mongoose.model('Parcel', parcelSchema);