import { useState } from "react"
import axios from "axios"
import { useTranslation } from 'react-i18next'
import ArtistSelector from "../ArtistSelector/ArtistSelector"
import RecommendationsList from "../RecommendationsList/RecommendationsList"
import { Grid, Typography, Box, Container } from "@mui/material"
import { MusicNote } from "@mui/icons-material"

const Home = () => {

    const { t } = useTranslation()
    
    const [artists, setArtists] = useState<string[]>([])
    const [recomendacion, setRecomendacion] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState<string>('')
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [totalFound, setTotalFound] = useState(0)

    const handleSelect = (artist: string | null) => {
        if (artist && artists.length < 3 && !artists.includes(artist)) {
            setArtists([...artists, artist])
            setSearchValue('')
        }
    }

    const handleRemoveArtist = (indexToRemove: number) => {
        setArtists(artists.filter((_, index) => index !== indexToRemove))
    }

    const handleRecommend = async (isLoadMore = false) => {
        if (artists.length === 0) {
            setError(t('selectAtLeastOne'))
            return
        }

        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
            setOffset(0)
            setRecomendacion([])
        }
        
        setError(null)
        
        try {
            const currentOffset = isLoadMore ? offset : 0
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const response = await axios.post(`${API_URL}/recommend`, {
                artists: artists,
                limit: 5,
                offset: currentOffset
            })

            // Manejar respuesta según status code
            if (response.status === 200 && response.data.success) {
                const newRecommendations = response.data.data.recommendations || []
                
                // Caso especial: no se encontraron artistas
                if (response.data.total_found === 0) {
                    if (!isLoadMore) {
                        setRecomendacion([])
                    }
                    setHasMore(false)
                    setTotalFound(0)
                    setError(t('noArtistsFound'))
                    return
                }
                
                if (isLoadMore) {
                    setRecomendacion(prev => [...prev, ...newRecommendations])
                } else {
                    setRecomendacion(newRecommendations)
                }
                
                setOffset(currentOffset + 5)
                setHasMore(response.data.has_more || false)
                setTotalFound(response.data.total_found || 0)
                
                // Mostrar mensaje si algunos artistas no se encontraron
                if (response.data.data.not_found_artists?.length > 0 && newRecommendations.length > 0) {
                    // Solo mostrar warning si hay recomendaciones pero algunos artistas no se encontraron
                    console.warn('Artistas no encontrados:', response.data.data.not_found_artists)
                }
            } else {
                setHasMore(false)
                setError(response.data?.message || t('serverError'))
            }
            
        } catch (error: any) {
            console.error('Error:', error)
            setError(error.response?.data?.message || t('serverError'))
            if (!isLoadMore) {
                setRecomendacion([])
            }
            setHasMore(false)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                py: 4,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0 auto',
                padding: '0 16px'
            }}
        >
            <Box textAlign="center" mb={4}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                }}>
                    <MusicNote sx={{ fontSize: '2rem', color: '#FE6B8B' }} />
                    {t('title')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {t('subtitle')}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ArtistSelector
                        artists={artists}
                        searchValue={searchValue}
                        loading={loading}
                        error={error}
                        onSelect={handleSelect}
                        onRemoveArtist={handleRemoveArtist}
                        onRecommend={() => handleRecommend(false)}
                        onSearchValueChange={setSearchValue}
                        onErrorClose={() => setError(null)}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <RecommendationsList 
                        recommendations={recomendacion}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                        totalFound={totalFound}
                        onLoadMore={() => handleRecommend(true)}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home