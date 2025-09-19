import { collection, onSnapshot } from "firebase/firestore";
import { ScatterChart, Scatter, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { firebaseAuth, firestoreDB } from "../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useMemo, useState } from "react";

interface ClusterInfo {
    id: string;
    interest: string;
    x: number;
    y: number;
    cluster: number;
    photoBase64?: string;
}

const ClusterChart = () => {
    const [user] = useAuthState(firebaseAuth);
    const [clustersData, setClustersData] = useState<ClusterInfo[]>([]);

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
                            photoBase64: data.profile?.photoBase64 || undefined
                        });
                    }
                });

                setClustersData(clustersData);
            }
        );

        return () => unsub(); // cleanup listener saat unmount
    }, [user]);

    const clusterData = useMemo(() => {
        // Optional: group data by cluster
        const clusters = Array.from(new Set(clustersData.map(d => d.cluster)));

        const clusterData = clusters.map(c => ({
            cluster: c,
            points: clustersData.filter(d => d.cluster === c)
        }));
        return clusterData;
    }, [clustersData])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{ top: 50, right: 20, bottom: 100, left: 20 }}
            >
                {/* <CartesianGrid /> */}
                <XAxis type="number" dataKey="x" name="X" axisLine={false} tickLine={false} tick={false} />
                <YAxis type="number" dataKey="y" name="Y" axisLine={false} tickLine={false} tick={false} />
                <Legend />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />

                {clusterData.map((c, idx) => (
                    <Scatter
                        key={idx}
                        name={`Cluster ${c.cluster}`}
                        data={c.points}
                        shape={(props: unknown) => {
                            const { cx, cy, payload } = props as { cx: number; cy: number; payload: ClusterInfo };
                            const imgSize = 150;
                            return (
                                <>
                                    <image
                                        href={payload.photoBase64 || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                        x={cx - imgSize / 2}
                                        y={cy - imgSize / 2}
                                        width={imgSize}
                                        height={imgSize}
                                        clipPath="circle(35%)"
                                    />
                                    <text x={cx} y={cy + imgSize / 2} textAnchor="middle" fontSize={14} fill="#333" fontWeight={'bold'}>
                                        {payload.cluster}
                                    </text>
                                </>
                            );
                        }} // pakai image
                    />
                ))}

            </ScatterChart>
        </ResponsiveContainer>
    )
}

export default ClusterChart