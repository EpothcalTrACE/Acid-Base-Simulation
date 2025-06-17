// routes/simulationRoutes.js
import express from 'express';
import Simulation from '../models/Simulation.js';
import Results from '../models/Results.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/simulations', async (req, res) => {
    try {
        const { userId, parameters } = req.body;

        // Input validation
        if (!parameters) {
            return res.status(400).json({ message: 'Parameters are required' });
        }

        const required = ['acidConcentration', 'baseConcentration', 'ka'];
        for (const param of required) {
            if (parameters[param] === undefined) {
                return res.status(400).json({ message: `Missing required parameter: ${param}` });
            }
        }

        // Calculate simulation results first
        const calculationResults = calculateAcidBaseEquilibrium(parameters);

        // Create a new simulation with the calculated results
        const newSimulation = new Simulation({
            userId,
            parameters,
            results: calculationResults.allValues,
            createdAt: new Date()
        });

        // Save the simulation first to get its ID
        const savedSimulation = await newSimulation.save();

        // Create the results document that references the simulation
        const newResults = new Results({
            simulationId: savedSimulation._id,
            dynamicPH: calculationResults.summary.equivalencePH,
            equilibriumConstant: parameters.ka,
            reactionKinetics: {
                initialPH: calculationResults.summary.initialPH,
                finalPH: calculationResults.summary.finalPH,
                bufferCapacity: calculationResults.summary.bufferCapacity,
                dataPoints: calculationResults.allValues
            },
            createdAt: new Date()
        });

        // Save the results
        const savedResults = await newResults.save();

        // Return both the simulation and results
        res.status(200).json({
            simulation: savedSimulation,
            results: savedResults
        });

    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * Calculate acid-base equilibrium for weak acid/base systems
 * Uses the quadratic formula to solve for [H+] in solution
 */
function calculateAcidBaseEquilibrium(parameters) {
    const { acidConcentration, baseConcentration, ka } = parameters;

    // For a weak acid HA ⇌ H+ + A-
    // Ka = [H+][A-]/[HA]

    const kw = 1.0e-14; // Water dissociation constant at 25°C

    // For weak acid alone (without added base)
    function solveForHydronium(ca, k) {
        // Using the quadratic formula to solve for [H+]
        // [H+]² + Ka[H+] - Ka·Ca - Kw = 0

        const a = 1;
        const b = k;
        const c = -(k * ca + kw);

        // Quadratic formula: (-b ± √(b² - 4ac)) / 2a
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            throw new Error('No real solution exists for these parameters');
        }

        // We typically take the positive root for [H+]
        const hPlus = (-b + Math.sqrt(discriminant)) / (2 * a);
        return hPlus;
    }

    // Calculate pH values at different mixing ratios
    const points = 100;
    const allValues = [];

    // Generate data for titration curve
    for (let i = 0; i <= points; i++) {
        const ratio = i / points;
        const currentAcidConc = acidConcentration * (1 - ratio);
        const currentBaseConc = baseConcentration * ratio;

        // If we're at exact equivalence point or nearly there
        let hPlus, pH;
        if (Math.abs(currentAcidConc - currentBaseConc) < 1e-10) {
            // At equivalence point, pH is determined by the hydrolysis of the salt
            pH = 7 + 0.5 * Math.log10(currentAcidConc / ka);
            hPlus = Math.pow(10, -pH);
        } else if (currentAcidConc > currentBaseConc) {
            // Excess acid
            hPlus = solveForHydronium(currentAcidConc - currentBaseConc, ka);
            pH = -Math.log10(hPlus);
        } else {
            // Excess base (after equivalence point)
            const oh = currentBaseConc - currentAcidConc;
            hPlus = kw / oh;
            pH = -Math.log10(hPlus);
        }

        const pOH = 14 - pH;
        const percentDissociation = currentAcidConc > 0
            ? (hPlus / currentAcidConc) * 100
            : 0;

        allValues.push({
            volumeRatio: ratio,
            pH: pH,
            pOH: pOH,
            hydroniumConcentration: hPlus,
            hydroxideConcentration: kw / hPlus,
            percentDissociation: percentDissociation
        });
    }

    // Calculate key points for the summary
    const initialPH = allValues[0].pH;
    const equivalencePH = allValues[Math.floor(points / 2)].pH;
    const finalPH = allValues[points].pH;

    // Calculate buffering capacity at half-equivalence point
    const halfEquivIndex = Math.floor(points / 4);
    const bufferCapacity = Math.abs(1 / (allValues[halfEquivIndex + 1].pH - allValues[halfEquivIndex - 1].pH));

    const summary = {
        initialPH,
        equivalencePH,
        finalPH,
        bufferCapacity,
        pKa: -Math.log10(ka)
    };

    return { allValues, summary };
}

export default router;