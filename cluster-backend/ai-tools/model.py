from pydantic import BaseModel, Field


class KMeansClusterItemModel(BaseModel):
    id: str | None = Field(default=None, examples=["user-123"])
    name: str = Field(examples=["budi"])
    interest: str = Field(examples=["ngoding game"])


class KMeansClusterModel(BaseModel):
    n_cluster: int = Field(default=3, examples=[3])
    users: list[KMeansClusterItemModel] = Field(examples=[
        [
            KMeansClusterItemModel(name="Budi", interest="coding game anime"),
            KMeansClusterItemModel(name="Sinta", interest="musik dance"),
            KMeansClusterItemModel(name="Andi", interest="game basket"),
            KMeansClusterItemModel(name="Nia", interest="membaca menulis"),
            KMeansClusterItemModel(name="Raka", interest="anime musik"),
            KMeansClusterItemModel(name="Dewi", interest="basket coding"),
            KMeansClusterItemModel(name="Farah", interest="menulis puisi"),
            KMeansClusterItemModel(name="Rian", interest="ngoding AI machine learning"),
            KMeansClusterItemModel(name="Lia", interest="kpop dance musik"),
            KMeansClusterItemModel(name="Fajar", interest="sepakbola futsal"),
            KMeansClusterItemModel(name="Tono", interest="basket olahraga"),
            KMeansClusterItemModel(name="Sari", interest="anime manga jepang"),
            KMeansClusterItemModel(name="Agus", interest="game mobile legends"),
            KMeansClusterItemModel(name="Putri", interest="drama korea musik"),
            KMeansClusterItemModel(name="Bayu", interest="robotik iot coding"),
            KMeansClusterItemModel(name="Mega", interest="sastra menulis puisi"),
            KMeansClusterItemModel(name="Rizki", interest="musik gitar band"),
            KMeansClusterItemModel(name="Yuni", interest="design ui ux"),
            KMeansClusterItemModel(name="Eka", interest="volley olahraga"),
            KMeansClusterItemModel(name="Tika", interest="membaca novel"),
            KMeansClusterItemModel(name="Joko", interest="ngoding web backend"),
            KMeansClusterItemModel(name="Wulan", interest="kpop anime musik"),
            KMeansClusterItemModel(name="Dian", interest="puisi sastra menulis"),
            KMeansClusterItemModel(name="Ilham", interest="game fps valorant"),
            KMeansClusterItemModel(name="Ayu", interest="dance musik kpop"),
            KMeansClusterItemModel(name="Yanto", interest="ngoding frontend react"),
            KMeansClusterItemModel(name="Fitri", interest="drama film korea"),
            KMeansClusterItemModel(name="Bagas", interest="esports game dota"),
            KMeansClusterItemModel(name="Reni", interest="anime romance manga"),
            KMeansClusterItemModel(name="Galih", interest="AI deep learning coding")
        ]
    ])

class KMeansClusterReadItemModel(BaseModel):
    name: str = Field(examples=["budi"])
    interest: str = Field(examples=["ngoding game"])
    x: float
    y: float
    cluster: float

class KMeansClusterReadModel(BaseModel):
    users: list[KMeansClusterReadItemModel]