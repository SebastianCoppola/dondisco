import { useState } from "react"
import axios from "axios"
import { Autocomplete, TextField } from "@mui/material"
import { useTranslation } from 'react-i18next'

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY

interface IArtistSearch {
    onSelect: (value: string | null) => void
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
}

const ArtistSearch = ({ onSelect, value = '', onChange, disabled = false }: IArtistSearch) => {

    const { t } = useTranslation()
    
    const [options, setOptions] = useState([])

    const handleSearch = async (_: any, newValue: string) => {
        onChange?.(newValue)
        if (newValue.length < 3) return
        try {
            const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
                params: {
                    method: "artist.search",
                    artist: newValue,
                    api_key: API_KEY,
                    format: "json",
                    limit: 5
                }
            })
            const artists = res.data.results.artistmatches.artist.map((a: any) => a.name)
            setOptions(artists)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Autocomplete
            freeSolo
            options={options}
            value={value}
            disabled={disabled}
            onInputChange={handleSearch}
            onChange={(_, selectedValue) => onSelect(selectedValue)}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label={disabled ? t('maxArtistsReached') : t('searchArtists')}
                    placeholder={disabled ? '' : t('searchPlaceholder')}
                    variant='outlined'
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                                borderColor: disabled ? 'rgba(255,255,255,0.23)' : '#FE6B8B',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: disabled ? 'rgba(255,255,255,0.23)' : '#FE6B8B',
                            }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: disabled ? 'rgba(255,255,255,0.5)' : '#FE6B8B',
                        }
                    }}
                />
            )}
            sx={{
                '& .MuiAutocomplete-option': {
                    '&:hover': {
                        backgroundColor: 'rgba(254, 107, 139, 0.1)',
                    }
                }
            }}
        />
    )
}

export default ArtistSearch