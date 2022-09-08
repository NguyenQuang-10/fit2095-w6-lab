const express = require("express");
const mongoose = require("mongoose");

const Sender = require("../models/sender.js");
const Parcel = require("../models/parcel.js");

module.exports = {
    getSender: (req,res) => {
        Sender.find({name: req.params.name}).populate('parcels').exec((err, doc) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(doc);
            }
        });
    },

    createOne: (req,res) => {
        let query = {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            parcels: [] 
        }
        let newSender = new Sender(query);
        newSender.save((err) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(query);
            }
        });
    },
    deleteOne: (req,res) => {
        let id = mongoose.Types.ObjectId(req.body.id.trim());
        Parcel.deleteMany({ sender : id }, (err, doc) => {
            if (err) {
                res.status(400).json(err);
            } else {
                Sender.deleteOne({ _id : id }, (err,doc) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(doc);
                    }
                });
            }
        })
        
    },
    updateOne: (req,res) => {
        Sender.updateOne({_id : mongoose.Types.ObjectId(req.body.id.trim())}, {$set : {name : req.body.name}}, (err,doc) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(doc);
            }
        } );
    }
}