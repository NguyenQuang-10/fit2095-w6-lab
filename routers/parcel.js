const express = require("express");
const mongoose = require("mongoose");

const Sender = require("../models/sender.js");
const Parcel = require("../models/parcel.js");

module.exports = {
    addParcel : (req, res) => {
        let reqBody = {
            _id: new mongoose.Types.ObjectId(),
            sender: mongoose.Types.ObjectId(req.body.sender),
            address: req.body.address,
            weight: parseFloat(req.body.weight),
            fragile: req.body.fragile === "true"
        }
        let newParcel = new Parcel(reqBody);
        newParcel.save((err) => {
            if (err) {
                res.status(400).json(err);
            } else {
                Sender.find({ _id : reqBody.sender}, (err, doc) => {
                    if (err) {
                        res.status(400).json(err);;
                    } else {
                        if (doc.length > 0 ){
                            let newParcelsArray = doc[0].parcels;
                            newParcelsArray.push(reqBody._id);

                            Sender.updateOne({ _id : reqBody.sender}, {$set: {parcels: newParcelsArray} }, (err,doc) => {
                                if (err) {
                                    res.status(400).json(err);
                                } else {
                                    res.status(200).json(reqBody);
                                }
                            })
                        } else {
                            res.status(400).json({error : "can't find sender"})
                        }
                    }
                });
                
            }
        })
    },
    getByAddress: (req,res) => {
        Parcel.find({ address : req.query.address }).populate('sender').exec((err, doc) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(doc);
            }
        });
    },
    updateAddress: (req, res) => {
        Parcel.updateOne({ _id : mongoose.Types.ObjectId(req.body.id) }, {$set : { address : req.body.address} }, (err, doc) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(doc);
            }
        });
    }
}