import mongoose from 'mongoose';

const rentAgreementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agreementCity: {
    type: String,
    required: true
  },
  agreementType: {
    type: String,
    required: true
  },
  executionDate: {
    type: String,
    required: true
  },
  landlords: [{
    title: String,
    name: {
      type: String,
      required: true
    },
    parentName: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    pan: {
      type: String,
      required: true
    },
    aadhaar: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  }],
  tenants: [{
    title: String,
    name: {
      type: String,
      required: true
    },
    parentName: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    pan: {
      type: String,
      required: true
    },
    aadhaar: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  }],
  propertyAddress: {
    type: String,
    required: true
  },
  leasePeriod: {
    type: String,
    required: true
  },
  rentAmount: {
    type: String,
    required: true
  },
  rentType: {
    type: String,
    required: true
  },
  rentPaymentDay: {
    type: String,
    required: true
  },
  rentIncrement: {
    type: String,
    required: true
  },
  refundableDeposit: {
    type: String,
    required: true
  },
  noticePeriod: {
    type: String,
    required: true
  },
  lockInPeriod: {
    type: String,
    required: true
  },
  utilities: {
    ac: {
      type: Number,
      default: 0
    },
    aircooler: {
      type: Number,
      default: 0
    },
    bed: {
      type: Number,
      default: 0
    },
    chair: {
      type: Number,
      default: 0
    },
    cupboard: {
      type: Number,
      default: 0
    },
    curtain: {
      type: Number,
      default: 0
    },
    electricGeyser: {
      type: Number,
      default: 0
    },
    fan: {
      type: Number,
      default: 0
    },
    gasGeyser: {
      type: Number,
      default: 0
    },
    refrigerator: {
      type: Number,
      default: 0
    },
    sofa: {
      type: Number,
      default: 0
    },
    table: {
      type: Number,
      default: 0
    },
    tubeLight: {
      type: Number,
      default: 0
    },
    tv: {
      type: Number,
      default: 0
    },
    washingMachine: {
      type: Number,
      default: 0
    },
    watercooler: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const RentAgreement = mongoose.model('RentAgreement', rentAgreementSchema);

export default RentAgreement;