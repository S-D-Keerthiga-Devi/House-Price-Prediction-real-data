import mongoose from 'mongoose';

const escrowSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  serviceNeed: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Escrow = mongoose.model('Escrow', escrowSchema);

export default Escrow;