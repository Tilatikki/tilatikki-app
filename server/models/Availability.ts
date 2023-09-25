import { Document, Schema, Model, model } from 'mongoose';
import User, { IUser } from './User';
import { IPremise } from './Premise';
import { ISpace } from './Space';
import { IReservation } from './Reservation';

// For internal model definition only.
interface SchemaAvailability {
  creator: Schema.Types.ObjectId | IUser;
  startdate: Date;
  enddate: Date;
  premise: Schema.Types.ObjectId | IPremise;
  space: Schema.Types.ObjectId | ISpace;
  reservations: Schema.Types.ObjectId[] | IReservation[];
}

// Use this interface for objects of this type. (adds _id field)
export interface IAvailability extends SchemaAvailability, Document {}

// Typeguard to check if the value is of type IAvailability.
export function isAvailability(value: any): value is IAvailability {
  return (
    value &&
    value._id instanceof Schema.Types.ObjectId &&
    value.startdate instanceof Date &&
    value.enddate instanceof Date &&
    value.creator instanceof Schema.Types.ObjectId &&
    value.premise instanceof Schema.Types.ObjectId &&
    value.space instanceof Schema.Types.ObjectId &&
    value.reservations.every((element:any) => element instanceof Schema.Types.ObjectId)
  )
};

// Typeguard to check if the value is of type IAvailability[].
export function isAvailabilityList(value: any): value is IAvailability[] {
  return (
    Array.isArray(value) &&
    value.every(element => element instanceof Availability)
  );
}

const availabilitySchema = new Schema<SchemaAvailability>({
  // Creator is only required for availabilities created by users.
  // Availabilities that might be added from APIs dont need a creator.
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  premise: {
    type: Schema.Types.ObjectId,
    ref: 'Premise',
  },
  space: {
    type: Schema.Types.ObjectId,
    ref: 'Space',
  },
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
  }]
});

const Availability: Model<IAvailability> = model<IAvailability>('Availability', availabilitySchema);

export default Availability;