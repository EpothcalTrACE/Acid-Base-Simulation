import React, { useState } from 'react';
import { Line, Bar, Scatter } from 'recharts';
import { Button, Card, CardContent, Switch, Input } from '@/components/ui';

export default function AcidBaseSimulation() {
    const [concentration, setConcentration] = useState(0.1);
    const [pH, setPH] = useState(7);
    const [temperature, setTemperature] = useState(25);
    const [data, setData] = useState([]);

    const handleRunSimulation = () => {
        // Placeholder for simulation logic
        const newData = Array.from({ length: 20 }, (_, i) => ({
            time: i,
            reactionRate: Math.sin(i / 2) * concentration,
            equilibriumConstant: Math.exp(-i / 10) * pH
        }));
        setData(newData);
    };

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            {/* Home Screen */}
            <header className="text-center py-8">
                <h1 className="text-4xl font-bold">Acid-Base Simulation Tool</h1>
                <p className="text-gray-600">Visualizing acid-base reactions in real-time.</p>
            </header>

            {/* Simulation Setup */}
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label>Concentration (M):</label>
                            <Input
                                type="number"
                                value={concentration}
                                onChange={(e) => setConcentration(parseFloat(e.target.value))}
                                className="w-full"
                            />

                            <label>pH Level:</label>
                            <Input
                                type="number"
                                value={pH}
                                onChange={(e) => setPH(parseFloat(e.target.value))}
                                className="w-full"
                            />

                            <label>Temperature (°C):</label>
                            <Input
                                type="number"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleRunSimulation} className="bg-blue-500 text-white">Run Simulation</Button>
                            <Button className="bg-yellow-400 text-white">Pause</Button>
                            <Button className="bg-red-500 text-white">Reset</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Screen */}
            {data.length > 0 && (
                <div className="my-8">
                    <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">Reaction Kinetics (Line Graph)</h3>
                            <Line data={data} dataKey="reactionRate" stroke="#3b82f6" />
                        </div>
                        <div>
                            <h3 className="font-medium">Equilibrium Constants (Bar Chart)</h3>
                            <Bar data={data} dataKey="equilibriumConstant" fill="#22c55e" />
                        </div>
                        <div>
                            <h3 className="font-medium">pH vs. Concentration (Scatter Plot)</h3>
                            <Scatter data={data} dataKey="reactionRate" fill="#ef4444" />
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Screen */}
            <Card className="mt-8">
                <CardContent>
                    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                    <div className="flex items-center gap-4">
                        <label>Enable Sound Alerts:</label>
                        <Switch />
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <label>Dark Mode:</label>
                        <Switch />
                    </div>
                    <Button className="mt-4 bg-green-500 text-white">Save Preferences</Button>
                </CardContent>
            </Card>
        </div>
    );
}
