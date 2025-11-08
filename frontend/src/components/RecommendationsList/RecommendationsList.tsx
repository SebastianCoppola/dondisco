import { 
    Box, 
    Paper, 
    Typography, 
    Card, 
    CardContent, 
    Fade,
    Button,
    CircularProgress,
    Divider
} from "@mui/material"
import { PlayArrow, MusicNote } from "@mui/icons-material"
import { useTranslation } from 'react-i18next'

interface IRecommendationsList {
    recommendations: string[]
    hasMore?: boolean
    loadingMore?: boolean
    totalFound?: number
    onLoadMore?: () => void
}

const RecommendationsList = ({ 
    recommendations, 
    hasMore = false, 
    loadingMore = false, 
    totalFound = 0, 
    onLoadMore 
}: IRecommendationsList) => {
    const { t } = useTranslation()
    
    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                borderRadius: 3, 
                minHeight: 400
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 2 
            }}>
                <PlayArrow color="secondary" />
                {t('recommendations')}
            </Typography>
            
            {recommendations.length > 0 ? (
                <Box>
                    {recommendations.map((artist, index) => (
                        <Fade 
                            key={index} 
                            in={true} 
                            timeout={300 + index * 100}
                        >
                            <Card 
                                sx={{ 
                                    mb: 2, 
                                    backgroundColor: 'action.hover',
                                    '&:hover': {
                                        backgroundColor: 'action.selected',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s ease-in-out'
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    cursor: 'pointer'
                                }}
                            >
                                <CardContent sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    py: 2 
                                }}>
                                    <Box 
                                        sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            borderRadius: '50%', 
                                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                                            {artist}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('recommendedArtist')}
                                        </Typography>
                                    </Box>
                                    <MusicNote color="action" />
                                </CardContent>
                            </Card>
                        </Fade>
                    ))}
                    
                    {/* Información y botón cargar más */}
                    {recommendations.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Divider sx={{ mb: 2 }} />
                            
                            {/* Información de resultados */}
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                {t('showing')} {recommendations.length} {t('of')} {totalFound} {t('results')}
                            </Typography>
                            
                            {/* Botón cargar más */}
                            {hasMore && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={onLoadMore}
                                        disabled={loadingMore}
                                        startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                                        sx={{
                                            borderRadius: 2,
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            '&:hover': {
                                                borderColor: 'primary.dark',
                                                backgroundColor: 'rgba(255, 107, 139, 0.1)',
                                            }
                                        }}
                                    >
                                        {loadingMore ? t('loading') : t('loadMore')}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        minHeight: 300,
                        textAlign: 'center' 
                    }}
                >
                    <MusicNote 
                        sx={{ 
                            fontSize: 80, 
                            color: 'text.disabled', 
                            mb: 2 
                        }} 
                    />
                    <Typography variant="h6" gutterBottom>
                        {t('waitingForTastes')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('selectArtistsMessage')}
                    </Typography>
                </Box>
            )}
        </Paper>
    )
}

export default RecommendationsList