const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PokeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  level: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PokeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

PokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PokeModel.find(search).select('name level age').lean().exec(callback);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;
