import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { ScatterChart, Scatter, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { firebaseAuth, firestoreDB } from "../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useMemo } from "react";
import { queryClient } from "../../../lib/queryclient";

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

    // Contoh data dari API
    const { data, error } = useQuery({
        queryKey: ['clusterData'],
        initialData: [],
        queryFn: async () => {
            const querySnapshot = await getDocs(collection(firestoreDB, "userInterestsClustered"));
            const clustersData: ClusterInfo[] = [];
            querySnapshot.forEach((doc) => {
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
            return clustersData;
        },
        enabled: !!user,
    })

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ['clusterData'] });
        }
    }, [user]);

    const clusterData = useMemo(() => {
        // Optional: group data by cluster
        const clusters = Array.from(new Set(data.map(d => d.cluster)));

        const clusterData = clusters.map(c => ({
            cluster: c,
            points: data.filter(d => d.cluster === c)
        }));
        return clusterData;
    }, [data])

    if (error) {
        return <div>Error loading data: {error.message}</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
                margin={{ top: 50, right: 20, bottom: 100, left: 20 }}
            >
                {/* <CartesianGrid /> */}
                <XAxis type="number" dataKey="x" name="X" axisLine={false} tickLine={false} tick={false} />
                <YAxis type="number" dataKey="y" name="Y" axisLine={false} tickLine={false} tick={false} />
                <Legend />

                {clusterData.map((c, idx) => (
                    <Scatter
                        key={idx}
                        name={`Cluster ${c.cluster}`}
                        data={c.points}
                        shape={(props: unknown) => {
                            console.log(props)
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