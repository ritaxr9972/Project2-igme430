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

  image: {
    type: String,
    required: true,
    trim: true,
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
  image: doc.image,
  owner: doc.id,
});

PokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PokeModel.find(search).select('name image id').lean().exec(callback);
};

PokeSchema.statics.deleteFavorite = (data, callback) => {
  console.log(data);

  const search = {
    owner: convertId(data.owner),
  };

  return PokeModel.find(search).deleteOne({ _id: data._id }, callback);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;
