const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  number: { type: String, required: true },
  capacity: { type: Number, required: true },
  reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
  floor: { type: Schema.Types.ObjectId, ref: 'Floor' }

});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
