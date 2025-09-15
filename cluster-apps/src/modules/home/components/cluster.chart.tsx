import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const ClusterChart = () => {
    // Contoh data dari API
    const data = [
        {
            "name": "Budi",
            "interest": "coding game anime",
            "x": -0.029657703143021685,
            "y": -0.41360817366758923,
            "cluster": 0
        },
        {
            "name": "Sinta",
            "interest": "musik dance",
            "x": 0.6278673229064543,
            "y": 0.2370020512506989,
            "cluster": 2
        },
        {
            "name": "Andi",
            "interest": "game basket",
            "x": -0.22464628097319883,
            "y": -0.4737696330355958,
            "cluster": 0
        },
        {
            "name": "Nia",
            "interest": "membaca menulis",
            "x": -0.3414977336628484,
            "y": 0.3932324271509877,
            "cluster": 1
        },
        {
            "name": "Raka",
            "interest": "anime musik",
            "x": 0.5071312220739013,
            "y": 0.03182297294384073,
            "cluster": 2
        },
        {
            "name": "Dewi",
            "interest": "basket coding",
            "x": -0.21221284754313471,
            "y": -0.45110771230189456,
            "cluster": 0
        },
        {
            "name": "Farah",
            "interest": "menulis puisi",
            "x": -0.4677829872742873,
            "y": 0.6472920462252588,
            "cluster": 1
        },
        {
            "name": "Rian",
            "interest": "ngoding AI machine learning",
            "x": -0.1283475413649997,
            "y": -0.12570680305410092,
            "cluster": 0
        },
        {
            "name": "Lia",
            "interest": "kpop dance musik",
            "x": 0.7214441402026894,
            "y": 0.26979437761781333,
            "cluster": 2
        },
        {
            "name": "Fajar",
            "interest": "sepakbola futsal",
            "x": -0.07838101313303712,
            "y": -0.04440474139197797,
            "cluster": 0
        },
        {
            "name": "Tono",
            "interest": "basket olahraga",
            "x": -0.19648386566886275,
            "y": -0.33831528221204443,
            "cluster": 0
        },
        {
            "name": "Sari",
            "interest": "anime manga jepang",
            "x": 0.08313844011515348,
            "y": -0.11931078936132242,
            "cluster": 0
        },
        {
            "name": "Agus",
            "interest": "game mobile legends",
            "x": -0.1318254750090787,
            "y": -0.22932669879422313,
            "cluster": 0
        },
        {
            "name": "Putri",
            "interest": "drama korea musik",
            "x": 0.2682704705104517,
            "y": 0.07574361919716027,
            "cluster": 2
        },
        {
            "name": "Bayu",
            "interest": "robotik iot coding",
            "x": -0.12313260556049833,
            "y": -0.21498682064336774,
            "cluster": 0
        },
        {
            "name": "Mega",
            "interest": "sastra menulis puisi",
            "x": -0.491784327669876,
            "y": 0.6914020964307683,
            "cluster": 1
        },
        {
            "name": "Rizki",
            "interest": "musik gitar band",
            "x": 0.24061296181439767,
            "y": 0.07137179761939685,
            "cluster": 2
        },
        {
            "name": "Yuni",
            "interest": "design ui ux",
            "x": -0.0783810131330371,
            "y": -0.04440474139197792,
            "cluster": 0
        },
        {
            "name": "Eka",
            "interest": "volley olahraga",
            "x": -0.11937013908797221,
            "y": -0.1362962029694655,
            "cluster": 0
        },
        {
            "name": "Tika",
            "interest": "membaca novel",
            "x": -0.15202480073134994,
            "y": 0.0660055089084263,
            "cluster": 0
        },
        {
            "name": "Joko",
            "interest": "ngoding web backend",
            "x": -0.10139703385195004,
            "y": -0.06967200374325615,
            "cluster": 0
        },
        {
            "name": "Wulan",
            "interest": "kpop anime musik",
            "x": 0.62434095013767,
            "y": 0.11194940216475692,
            "cluster": 2
        },
        {
            "name": "Dian",
            "interest": "puisi sastra menulis",
            "x": -0.491784327669876,
            "y": 0.6914020964307684,
            "cluster": 1
        },
        {
            "name": "Ilham",
            "interest": "game fps valorant",
            "x": -0.1318254750090787,
            "y": -0.2293266987942232,
            "cluster": 0
        },
        {
            "name": "Ayu",
            "interest": "dance musik kpop",
            "x": 0.7214441402026894,
            "y": 0.26979437761781333,
            "cluster": 2
        },
        {
            "name": "Yanto",
            "interest": "ngoding frontend react",
            "x": -0.1013970338519499,
            "y": -0.06967200374325591,
            "cluster": 0
        },
        {
            "name": "Fitri",
            "interest": "drama film korea",
            "x": 0.00147600634799591,
            "y": -0.015048661671912726,
            "cluster": 0
        },
        {
            "name": "Bagas",
            "interest": "esports game dota",
            "x": -0.13182547500907865,
            "y": -0.22932669879422318,
            "cluster": 0
        },
        {
            "name": "Reni",
            "interest": "anime romance manga",
            "x": 0.08313844011515356,
            "y": -0.11931078936132229,
            "cluster": 0
        },
        {
            "name": "Galih",
            "interest": "AI deep learning coding",
            "x": -0.14510641507942193,
            "y": -0.2332183186259371,
            "cluster": 0
        }
    ];
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