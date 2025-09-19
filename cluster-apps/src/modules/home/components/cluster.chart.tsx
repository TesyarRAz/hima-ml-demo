import { collection, onSnapshot } from "firebase/firestore";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import { firebaseAuth, firestoreDB } from "../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import BaseModal from "../../../components/base-modal";
import useModal from "../../../hooks/use-modal";

interface ClusterInfo {
    id: string;
    name: string;
    interest: string;
    x: number;
    y: number;
    cluster: number;
    photoBase64?: string;
}

const ClusterChart = () => {
    const [user] = useAuthState(firebaseAuth);
    const [clustersData, setClustersData] = useState<ClusterInfo[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartDimensions, setChartDimensions] = useState({ width: 600, height: 400 });
    const [selectedUserInfo, setSelectedUserInfo] = useState<ClusterInfo | null>(null);

    useEffect(() => {
        if (!user) return;

        const unsub = onSnapshot(
            collection(firestoreDB, "userInterestsClustered"),
            (snapshot) => {
                const clustersData: ClusterInfo[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data) {
                        clustersData.push({
                            id: doc.id,
                            interest: data.interest,
                            x: data.x,
                            y: data.y,
                            cluster: data.cluster,
                            photoBase64: data.profile?.photoBase64 || undefined,
                            name: data.profile?.name || '',
                        });
                    }
                });
                
                setClustersData(clustersData);
            }
        );

        return () => unsub();
        
    }, [user]);

    // Monitor chart dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (chartRef.current) {
                const rect = chartRef.current.getBoundingClientRect();
                setChartDimensions({
                    width: rect.width || 600,
                    height: rect.height || 400
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        // Update after initial render
        const timer = setTimeout(updateDimensions, 100);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(timer);
        };
    }, []);

    const clusterData = useMemo(() => {
        if (clustersData.length === 0) return [];

        const clusters = Array.from(new Set(clustersData.map(d => d.cluster)));
        
        return clusters.map(c => {
            const points = clustersData.filter(d => d.cluster === c);
            const avgX = points.length > 0 ? points.reduce((s, p) => s + p.x, 0) / points.length : 0;
            const avgY = points.length > 0 ? points.reduce((s, p) => s + p.y, 0) / points.length : 0;
            
            return {
                cluster: c,
                points: points,
                centroidX: avgX,
                centroidY: avgY
            };
        });
    }, [clustersData]);

    // Calculate domains
    const xValues = clustersData.map(d => d.x);
    const yValues = clustersData.map(d => d.y);
    const xDomain = useMemo(() => xValues.length > 0 ? [Math.min(...xValues), Math.max(...xValues)] : [0, 1], [xValues])
    const yDomain = useMemo(() => yValues.length > 0 ? [Math.min(...yValues), Math.max(...yValues)] : [0, 1], [yValues]);

    // Custom component to draw cluster areas
    const ClusterAreas = useCallback(() => {
        if (clustersData.length === 0) return null;

        // Chart area calculations (considering margins)
        const margin = { top: 60, right: 30, bottom: 100, left: 30 };
        const chartWidth = chartDimensions.width - margin.left - margin.right;
        const chartHeight = chartDimensions.height - margin.top - margin.bottom;

        const xScale = (val: number) => 
            margin.left + ((val - xDomain[0]) / (xDomain[1] - xDomain[0])) * chartWidth;
        const yScale = (val: number) => 
            margin.top + chartHeight - ((val - yDomain[0]) / (yDomain[1] - yDomain[0])) * chartHeight;

        // Color palette untuk cluster
        const clusterColors = [
            '#ff6b6b', // red
            '#4ecdc4', // teal
            '#45b7d1', // blue
            '#96ceb4', // green
            '#feca57', // yellow
            '#ff9ff3', // pink
            '#54a0ff', // light blue
            '#5f27cd', // purple
        ];

        return (
            <svg 
                style={{ 
                    position: 'absolute', 
                    top: -80, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            >
                {/* Draw cluster background circles */}
                {clusterData.map((cluster, idx) => {
                    if (cluster.points.length < 2) return null;

                    const centroidPixelX = xScale(cluster.centroidX);
                    const centroidPixelY = yScale(cluster.centroidY);
                    
                    // Calculate cluster radius based on spread of points
                    const distances = cluster.points.map(point => {
                        const px = xScale(point.x);
                        const py = yScale(point.y);
                        return Math.sqrt(Math.pow(px - centroidPixelX, 2) + Math.pow(py - centroidPixelY, 2));
                    });
                    const maxDistance = Math.max(...distances);
                    const clusterRadius = Math.max(maxDistance + 40, 80); // minimum 80px radius

                    const color = clusterColors[idx % clusterColors.length];

                    return (
                        <g key={`cluster-${idx}`}>
                            {/* Background circle */}
                            <circle
                                cx={centroidPixelX}
                                cy={centroidPixelY}
                                r={clusterRadius}
                                fill={color}
                                opacity={0.1}
                                stroke={color}
                                strokeWidth={2}
                                strokeOpacity={0.3}
                                strokeDasharray="5,5"
                            />
                            {/* Centroid point */}
                            <circle
                                cx={centroidPixelX}
                                cy={centroidPixelY}
                                r={4}
                                fill={color}
                                stroke="#fff"
                                strokeWidth={2}
                                opacity={0.8}
                            />
                            {/* Cluster label */}
                            <text
                                x={centroidPixelX}
                                y={centroidPixelY - clusterRadius - 10}
                                textAnchor="middle"
                                fontSize={12}
                                fill={color}
                                fontWeight="bold"
                            >
                                Cluster {cluster.cluster}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    }, [clustersData, clusterData, xDomain, yDomain, chartDimensions]);

    const modal = useModal();

    return (
        <div ref={chartRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <BaseModal
                modalName="user-info"
                modalState={modal}
                title="User Information"
            >
                {selectedUserInfo && (
                    <div className="space-y-4 max-w-md">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={selectedUserInfo.photoBase64 || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                alt={selectedUserInfo.name}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{selectedUserInfo.name}</h2>
                                <p className="text-gray-600">Cluster: {selectedUserInfo.cluster}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Interest:</h3>
                            {selectedUserInfo.interest.split(' ').map((word, idx) => (
                                <span 
                                    key={idx}
                                    className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </BaseModal>

            <ClusterAreas />
            
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 60, right: 60, bottom: 100, left: 60 }}>
                    <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="X" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={false}
                        domain={xDomain}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Y" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={false}
                        domain={yDomain}
                    />
                    {/* <Legend /> */}
                    {/* <Tooltip cursor={{ strokeDasharray: "3 3" }} /> */}

                    {clusterData.map((c, idx) => (
                        <Scatter
                            key={idx}
                            name={`Cluster ${c.cluster}`}
                            data={c.points}
                            shape={(props: unknown) => {
                                const { cx, cy, payload } = props as {
                                    cx: number;
                                    cy: number;
                                    payload: ClusterInfo;
                                };
                                const imgSize = 50;
                                const clusterColors = [
                                    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
                                    '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
                                ];
                                const clusterColor = clusterColors[payload.cluster % clusterColors.length];
                                
                                return (
                                    <g style={{ zIndex: 10 }}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={imgSize / 2}
                                            fill="white"
                                            stroke={clusterColor}
                                            strokeWidth={3}
                                        />
                                        <image
                                            onClick={() => {
                                                setSelectedUserInfo(payload)
                                                modal.open("user-info")
                                            }}
                                            href={
                                                payload.photoBase64 ||
                                                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                            }
                                            x={cx - (imgSize - 6) / 2}
                                            y={cy - (imgSize - 6) / 2}
                                            width={imgSize - 6}
                                            height={imgSize - 6}
                                            clipPath="circle(45%)"
                                        />
                                        <text
                                            x={cx}
                                            y={cy + imgSize / 2 + 12}
                                            textAnchor="middle"
                                            fontSize={10}
                                            fill="#333"
                                            fontWeight="bold"
                                        >
                                            {payload.name} - {payload.cluster}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ClusterChart;