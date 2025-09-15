from contextlib import asynccontextmanager

import firebase_admin
from fastapi import FastAPI
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.feature_extraction.text import TfidfVectorizer
from starlette.middleware.cors import CORSMiddleware

import model
import pandas as pd
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def on_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        doc_id = change.document.id
        data = change.document.to_dict()

        resp = kmeans_user(model.KMeansClusterModel(
            users=[
                model.KMeansClusterItemModel(
                    name=doc_id,
                    interest=" ".join([x['name'] for x in data['interests']]),
                )
            ]
        ))
        print("Response: ", resp.model_dump())

@asynccontextmanager
async def lifespan(app: FastAPI):
    col_query = db.collection("userInterests")
    col_query.on_snapshot(on_snapshot)

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

    # === Vectorizer (AI NLP vibes) ===
    vectorizer = TfidfVectorizer()
    x = vectorizer.fit_transform(df["interest"])

    # === Clustering (AI grouping) ===
    kmeans = KMeans(n_clusters=3, random_state=42)
    df["cluster"] = kmeans.fit_predict(x)

    pca = PCA(n_components=2)
    coords = pca.fit_transform(x.toarray())
    df["x"] = coords[:, 0]
    df["y"] = coords[:, 1]

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