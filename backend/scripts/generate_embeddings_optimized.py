import os
import pandas as pd
import json
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer
from scipy.sparse import hstack, csr_matrix

print("🚀 Generando embeddings optimizados...")

# Paths
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPTS_DIR)
CSV_PATH = os.path.join(SCRIPTS_DIR, "global-music-artists.csv")
OUTPUT_DIR = BASE_DIR

print(f"📁 Cargando dataset desde: {CSV_PATH}")

# 1. Cargar el dataset
df = pd.read_csv(CSV_PATH)
print(f"📊 Dataset cargado: {len(df)} filas")

# 2. Limpiar datos
df = df.dropna(subset=["artist_name", "artist_genre", "country"])
df = df.drop_duplicates(subset=["artist_name"], keep="first")
print(f"🧹 Después de limpiar: {len(df)} artistas")

# 3. Vectorizar géneros
print("🎵 Procesando géneros...")
df['artist_genre'] = df['artist_genre'].str.split(',')
mlb = MultiLabelBinarizer(sparse_output=True)
genre_vectors = mlb.fit_transform(df['artist_genre'])

# 4. Vectorizar países
print("🌍 Procesando países...")
country_vectors = csr_matrix(pd.get_dummies(df['country']).values)

# 5. Combinar embeddings
print("🔗 Combinando vectores...")
embeddings = hstack([genre_vectors, country_vectors])
embeddings_array = embeddings.toarray()
print(f"📐 Embeddings shape: {embeddings_array.shape}")

# 6. OPTIMIZACIÓN: Precomputar embeddings normalizados con menos memoria
print("⚡ Precomputando embeddings normalizados (float32 para menos memoria)...")
embeddings_array = embeddings_array.astype(np.float32)  # Usar float32 en lugar de float64
embeddings_norms = np.linalg.norm(embeddings_array, axis=1, keepdims=True)
embeddings_normalized = embeddings_array / embeddings_norms

# 7. Guardar solo embeddings normalizados (archivo único para la API)
np.save(os.path.join(OUTPUT_DIR, "embeddings.npy"), embeddings_normalized)
print("✅ Embeddings normalizados guardados en backend/embeddings.npy")
print("💾 Solo se guarda un archivo para ahorrar espacio")

# 9. Guardar mappings
print("💾 Guardando mappings...")
artist_to_idx = dict(zip(df['artist_name'], range(len(df))))
idx_to_artist = dict(zip(range(len(df)), df['artist_name']))
with open(os.path.join(OUTPUT_DIR, "mappings.json"), "w", encoding="utf-8") as f:
    json.dump({"artist_to_idx": artist_to_idx, "idx_to_artist": idx_to_artist}, f)
print("✅ Mappings guardados en backend/mappings.json")

print(f"🎉 ¡Optimización completada!")
print(f"📏 Artistas procesados: {len(df)}")
print(f"📐 Dimensiones: {embeddings_array.shape}")
print("⚡ API será súper rápida tanto al arrancar como al responder!")