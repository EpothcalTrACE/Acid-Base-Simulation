import mongoose from 'mongoose';
const resultsSchema = mongoose.Schema({
    simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Simulation' },
    dynamicPH: { type: Number, required: true },
    equilibriumConstant: { type: Number, required: true },
    reactionKinetics: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Results', resultsSchema);