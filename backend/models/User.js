import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    email: { type: String, required: true, unique: true },
    savedSimulations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Simulation' }],
    auditLogs: [{ action: String, timestamp: Date }],
});
export default mongoose.model('User', userSchema);