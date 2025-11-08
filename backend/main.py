from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse, Response
import json
import numpy as np
from typing import List, Optional
import os

app = FastAPI(title="Artist Recommendation API")

# Configurar CORS - Permite múltiples orígenes
# En producción, reemplaza "*" con tu dominio específico
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "embeddings.npy")  # Usar embeddings precomputados
MAPPINGS_PATH = os.path.join(BASE_DIR, "mappings.json")

# --- Cargar embeddings y mappings ---
try:
    # Cargar embeddings normalizados precomputados (súper rápido)
    embeddings = np.load(EMBEDDINGS_PATH)
    
    # Cargar mappings desde JSON
    with open(MAPPINGS_PATH, "r", encoding="utf-8") as f:
        mappings = json.load(f)
    
    artist_to_idx = mappings["artist_to_idx"]
    idx_to_artist = mappings["idx_to_artist"]
    
    print(f"✅ Embeddings cargados: {embeddings.shape}")
    print(f"✅ Mappings cargados: {len(artist_to_idx)} artistas")
    print("⚡ API optimizada al máximo!")
    
except FileNotFoundError as e:
    print(f"❌ Error: No se encontraron los archivos necesarios.")
    print(f"❌ {e}")
    print("❌ Ejecuta primero: python scripts/generate_embeddings.py")
    raise
except Exception as e:
    print(f"❌ Error cargando datos: {e}")
    raise

# --- Modelos de request y response ---
class RecommendationRequest(BaseModel):
    artists: List[str]
    limit: int = 5
    offset: int = 0

class RecommendationResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
    total_found: Optional[int] = None
    has_more: Optional[bool] = None

# --- Función de similitud coseno ---
def cosine_similarity(vecA, vecB):
    dot = np.dot(vecA, vecB)
    normA = np.linalg.norm(vecA)
    normB = np.linalg.norm(vecB)
    return dot / (normA * normB) if normA > 0 and normB > 0 else 0

# --- Endpoint /health ---
@app.get("/health")
def health():
    return {"status": "ok", "total_artists": len(artist_to_idx)}

# --- Endpoint /artists/count ---
@app.get("/artists/count")
def get_artists_count():
    """Obtener el número total de artistas en el dataset"""
    return {
        "total_artists": len(artist_to_idx),
        "message": f"Dataset contiene {len(artist_to_idx)} artistas únicos"
    }

# --- Endpoint /recommend ---
@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    try:
        # Validar parámetros
        if not request.artists:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "message": "No se proporcionaron artistas para analizar",
                    "data": None
                }
            )
        
        if request.limit <= 0 or request.limit > 50:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "message": "El límite debe estar entre 1 y 50",
                    "data": None
                }
            )
        
        if request.offset < 0:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "message": "El offset no puede ser negativo",
                    "data": None
                }
            )
        
        # Buscar artistas en el dataset
        selected_idx = [artist_to_idx[a] for a in request.artists if a in artist_to_idx]
        found_artists = [a for a in request.artists if a in artist_to_idx]
        not_found_artists = [a for a in request.artists if a not in artist_to_idx]
        
        # Si no se encontró ningún artista
        if not selected_idx:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": f"Ninguno de los artistas está en nuestro dataset: {', '.join(not_found_artists)}",
                    "data": {
                        "input_artists": request.artists,
                        "found_artists": [],
                        "not_found_artists": not_found_artists,
                        "recommendations": [],
                        "offset": request.offset,
                        "limit": request.limit
                    },
                    "total_found": 0,
                    "has_more": False
                }
            )

        # Calcular vector promedio
        mean_vector = np.mean(embeddings[selected_idx], axis=0)
        mean_norm = np.linalg.norm(mean_vector)
        
        if mean_norm == 0:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": False,
                    "message": "Error interno: No se pudo calcular la similitud",
                    "data": None
                }
            )
        
        # Normalizar vector promedio
        mean_vector_normalized = mean_vector / mean_norm
        
        # Calcular similitudes (vectorizado)
        sim_scores = np.dot(embeddings, mean_vector_normalized)
        
        # Obtener todos los índices ordenados por similitud (excluyendo seleccionados)
        all_recommendations_idx = [i for i in sim_scores.argsort()[::-1] if i not in selected_idx]
        
        # Aplicar paginación
        total_found = len(all_recommendations_idx)
        start_idx = request.offset
        end_idx = start_idx + request.limit
        
        paginated_idx = all_recommendations_idx[start_idx:end_idx]
        recommendations = [idx_to_artist[str(i)] for i in paginated_idx]
        
        # Verificar si hay más resultados disponibles
        has_more = end_idx < total_found
        
        # Respuesta exitosa
        if recommendations:
            response_data = {
                "input_artists": request.artists,
                "found_artists": found_artists,
                "not_found_artists": not_found_artists,
                "recommendations": recommendations,
                "offset": request.offset,
                "limit": request.limit
            }
            
            message = f"Se encontraron {total_found} recomendaciones."
            if not_found_artists:
                message += f" Nota: {len(not_found_artists)} artista(s) no están en el dataset."
            
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "success": True,
                    "message": message,
                    "data": response_data,
                    "total_found": total_found,
                    "has_more": has_more
                }
            )
        else:
            # No hay recomendaciones en esta página
            return JSONResponse(
                status_code=status.HTTP_204_NO_CONTENT,
                content={
                    "success": False,
                    "message": "No hay más recomendaciones disponibles para este offset",
                    "data": {
                        "input_artists": request.artists,
                        "found_artists": found_artists,
                        "not_found_artists": not_found_artists,
                        "recommendations": [],
                        "offset": request.offset,
                        "limit": request.limit
                    },
                    "total_found": total_found,
                    "has_more": False
                }
            )
    
    except Exception as e:
        # Error interno del servidor
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"Error interno del servidor: {str(e)}",
                "data": None
            }
        )
