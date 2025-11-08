import { 
    Box, 
    Paper, 
    Typography, 
    Chip, 
    Button, 
    CircularProgress, 
    Alert, 
    Fade 
} from "@mui/material"
import { Album, Delete, Whatshot } from "@mui/icons-material"
import ArtistSearch from "../ArtistSearch/ArtistSearch"
import { useTranslation } from 'react-i18next'

interface IArtistSelector {
    artists: string[]
    searchValue: string
    loading: boolean
    error: string | null
    onSelect: (artist: string | null) => void
    onRemoveArtist: (index: number) => void
    onRecommend: () => void
    onSearchValueChange: (value: string) => void
    onErrorClose: () => void
}

const ArtistSelector = ({
    artists,
    searchValue,
    loading,
    error,
    onSelect,
    onRemoveArtist,
    onRecommend,
    onSearchValueChange,
    onErrorClose
}: IArtistSelector) => {
    const { t } = useTranslation()
    
    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                borderRadius: 3
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 2 
            }}>
                <Album color="primary" />
                {t('searchArtists')}
            </Typography>
            
            <ArtistSearch 
                onSelect={onSelect} 
                value={searchValue}
                onChange={onSearchValueChange}
                disabled={artists.length >= 3}
            />
            
            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    {t('selectedArtists')} ({artists.length}/3)
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {artists.map((artist, index) => (
                        <Chip
                            key={index}
                            label={artist}
                            onDelete={() => onRemoveArtist(index)}
                            deleteIcon={<Delete />}
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                    ))}
                    {artists.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            fontStyle: 'italic',
                            p: 2,
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            {t('noArtistsSelected')}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Botón de recomendación */}
            <Box mt={3}>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={onRecommend}
                    disabled={artists.length === 0 || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Whatshot />}
                    sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                        }
                    }}
                >
                    {loading ? t('generatingRecommendations') : t('getRecommendations')}
                </Button>
            </Box>

            {/* Error */}
            {error && (
                <Fade in={Boolean(error)}>
                    <Box mt={2}>
                        <Alert severity="error" onClose={onErrorClose}>
                            {error}
                        </Alert>
                    </Box>
                </Fade>
            )}
        </Paper>
    )
}

export default ArtistSelector