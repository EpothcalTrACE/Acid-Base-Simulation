import React, { useState } from 'react';
import { Line } from 'recharts';
import { Button, Card, CardContent, Input } from './components/ui.js';
import axios from 'axios';
import { renderCharts } from './visualization.js';


export default function AcidBaseSimulation() {
    const [acidConcentration, setAcidConcentration] = useState(0.1);
    const [ka, setKa] = useState(1.8e-5);
    const [baseConcentration, setBaseConcentration] = useState(0.1);
    const [data, setData] = useState([]);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'blue';
            ctx.fillRect(20, 20, 150, 100); // draw a rectangle to confirm it works
        }
    }, []);



    const handleRunSimulation = async () => {
        try {
            const response = await axios.post('/api/simulations', {
                parameters: { acidConcentration, ka, baseConcentration },
            });
            setData(response.data.results);
            renderCharts(response.data.results);
        } catch (error) {
            console.error('Simulation error:', error);
        }
    };


    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label>Acid Concentration (M):</label>
                            <Input
                                type="number"
                                value={acidConcentration}
                                onChange={(e) => setAcidConcentration(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <label>Ka:</label>
                            <Input
                                type="number"
                                value={ka}
                                onChange={(e) => setKa(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <label>Base Concentration (M):</label>
                            <Input
                                type="number"
                                value={baseConcentration}
                                onChange={(e) => setBaseConcentration(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button onClick={handleRunSimulation} className="bg-blue-500 text-white">Run Simulation</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {data.length > 0 && (
                <div className="my-8">
                    <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">pH Change Over Time</h3>
                            <Line data={data} dataKey="pH" stroke="#3b82f6" xdataKey="time" />
                        </div>
                    </div>
                    <div id="visualization-container"></div>
                </div>
            )}
        </div>
    );
}
