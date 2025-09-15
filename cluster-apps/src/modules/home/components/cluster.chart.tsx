import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { ScatterChart, Scatter, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { firestoreDB } from "../../../lib/firebase";

interface ClusterInfo {
    id: string;
    name: string;
    interest: string;
    x: number;
    y: number;
    cluster: number;
}

const ClusterChart = () => {
    // Contoh data dari API
    const { data } = useQuery({
        queryKey: ['clusterData'],
        initialData: [],
        queryFn: async () => {
            const querySnapshot = await getDocs(collection(firestoreDB, "clusters"));
            const clustersData: ClusterInfo[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data && data.name && data.interest && typeof data.x === 'number' && typeof data.y === 'number' && typeof data.cluster === 'number') {
                    clustersData.push({ id: doc.id, name: data.name, interest: data.interest, x: data.x, y: data.y, cluster: data.cluster });
                }
            });
            return clustersData;
        }
    })
    // Optional: group data by cluster
    const clusters = Array.from(new Set(data.map(d => d.cluster)));

    const clusterData = clusters.map(c => ({
        cluster: c,
        points: data.filter(d => d.cluster === c)
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{ top: 50, right: 20, bottom: 20, left: 20 }}
            >
                {/* <CartesianGrid /> */}
                <XAxis type="number" dataKey="x" name="X" axisLine={false} tickLine={false} tick={false} />
                <YAxis type="number" dataKey="y" name="Y" axisLine={false} tickLine={false} tick={false} />
                {/* <Tooltip cursor={{ strokeDasharray: '3 3' }} /> */}
                <Legend />

                {clusterData.map((c, idx) => (
                    <Scatter
                        key={idx}
                        name={`Cluster ${c.cluster}`}
                        data={c.points}
                        shape={(props: unknown) => {
                            const { cx, cy } = props as { cx: number; cy: number; };
                            const imgSize = 80;
                            return (
                                <image
                                    href="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                    x={cx - imgSize / 2}
                                    y={cy - imgSize / 2}
                                    width={imgSize}
                                    height={imgSize}
                                />
                            );
                        }} // pakai image
                    />
                ))}
            </ScatterChart>
        </ResponsiveContainer>
    )
}

export default ClusterChart