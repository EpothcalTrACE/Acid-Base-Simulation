import mongoose from 'mongoose';
const simulationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parameters: { type: Object, required: true },
    results: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Simulation', simulationSchema);