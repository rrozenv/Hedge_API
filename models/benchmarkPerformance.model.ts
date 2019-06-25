import mongoose from 'mongoose';
import IBenchmarkPerformance from '../interfaces/benchmarkPerfromance.interface';

const benchmarkPerformanceModelSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    performance: {
        type: Number,
        required: true
    }
});

type BenchmarkPerformanceType = IBenchmarkPerformance & mongoose.Document;
const BenchmarkPerformanceModel = mongoose.model<BenchmarkPerformanceType>('BenchmarkPerformance', benchmarkPerformanceModelSchema)

export { BenchmarkPerformanceModel, BenchmarkPerformanceType };