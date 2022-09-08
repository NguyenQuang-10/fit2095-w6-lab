var mongoose = require('mongoose');

var parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sender: {type: mongoose.Schema.ObjectId, ref: "Sender", required: true},
    weight: {type: Number, min: [0, "Weight can't be negative"], required: true},
    cost: {type: Number, min: [0, "Weight can't be negative"], required: true},
    address: {type: String, required: true},
    fragile: {type: Boolean, required: true}
});

module.exports = mongoose.model('Parcel', parcelSchema);