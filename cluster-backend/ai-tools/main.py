from contextlib import asynccontextmanager

import firebase_admin
from fastapi import FastAPI
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer
from starlette.middleware.cors import CORSMiddleware

import model
import pandas as pd
import numpy as np
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

globalAppSettings = {}
globalAppUsers = {}

def on_snapshot(col_snapshot, changes, read_time):
    # doc_id = change.document.id
    # data = change.document.to_dict()
    userInterests = [(doc.id, doc.to_dict()) for doc in db.collection("userInterests").get()]

    resp = kmeans_user(model.KMeansClusterModel(
        n_cluster=globalAppSettings.get("clusterNum", 3),
        users=[
            model.KMeansClusterItemModel(
                id=id,
                name=id,
                interest=" ".join([x['name'] for x in data["interests"]])
            )
            for id, data in userInterests
        ]
    ))
    for user in resp.users:
        db.collection("userInterestsClustered").document(user.name).set({
            "interest": user.interest,
            "x": user.x,
            "y": user.y,
            "cluster": user.cluster,
            "profile": globalAppUsers.get(user.name, {})
        })

def on_setting_snapshot(doc_snapshot, changes, read_time):
    appSettings = db.collection("settings").document("appSettings").get().to_dict() 
    globalAppSettings.update(appSettings)

    on_snapshot(None, None, None)

def on_user_snapshot(col_snapshot, changes, read_time):
    users = [(doc.id, doc.to_dict()) for doc in db.collection("users").get()]
    globalAppUsers.clear()
    for id, data in users:
        globalAppUsers[id] = data

    on_snapshot(None, None, None)

@asynccontextmanager
async def lifespan(app: FastAPI):
    col_query = db.collection("userInterests")
    col_query.on_snapshot(on_snapshot)

    col_setting_query = db.collection("settings").document("appSettings")
    col_setting_query.on_snapshot(on_setting_snapshot)

    col_user_query = db.collection("users")
    col_user_query.on_snapshot(on_user_snapshot)

    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/cluster/kmeans-user")
def kmeans_user(input: model.KMeansClusterModel):
    df = pd.DataFrame([user.model_dump() for user in input.users])

    try:
        # === Vectorizer (AI NLP vibes) ===
        vectorizer = TfidfVectorizer()
        x = vectorizer.fit_transform(df["interest"])

        # === Clustering (AI grouping) ===
        kmeans = KMeans(n_clusters=input.n_cluster, random_state=42)
        df["cluster"] = kmeans.fit_predict(x)

        pca = PCA(n_components=2)
        coords = pca.fit_transform(x.toarray())
        df["x"] = coords[:, 0]
        df["y"] = coords[:, 1]
    except Exception as _exception:
        df["cluster"] = 0
        df["x"] = np.random.randint(0, 110, size=len(df))
        df["y"] = np.random.randint(0, 110, size=len(df))

    return model.KMeansClusterReadModel(
        users=[
            model.KMeansClusterReadItemModel(
                name=row["name"],
                interest=row["interest"],
                x=float(row["x"]),
                y=float(row["y"]),
                cluster=float(row["cluster"])
            )
            for _, row in df.iterrows()
        ]
    )