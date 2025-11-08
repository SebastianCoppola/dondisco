import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    es: {
        translation: {
            // Header
            title: "DonDisco",
            subtitle: "Descubre tu próximo artista favorito con IA",
            
            // Artist Search
            searchArtists: "Buscar Artistas",
            searchPlaceholder: "Escribe al menos 3 caracteres...",
            maxArtistsReached: "Máximo de artistas alcanzado",
            selectedArtists: "Artistas seleccionados",
            noArtistsSelected: "No hay artistas seleccionados",
            
            // Recommendations
            recommendations: "Recomendaciones",
            getRecommendations: "Obtener Recomendaciones",
            generatingRecommendations: "Generando recomendaciones...",
            waitingForTastes: "¡Esperando tus gustos musicales!",
            selectArtistsMessage: "Selecciona algunos artistas para obtener recomendaciones personalizadas",
            recommendedArtist: "Artista recomendado",
            
            // Errors
            selectAtLeastOne: "Por favor, selecciona al menos un artista",
            serverError: "Error al obtener recomendaciones. ¿Está funcionando el servidor?",
            noArtistsFound: "No se encontraron ninguno de los artistas seleccionados",
            
            // Theme
            switchToLight: "Cambiar a tema claro",
            switchToDark: "Cambiar a tema oscuro",
            
            // Language
            language: "Idioma",
            spanish: "Español",
            english: "English",
            
            // Pagination
            showing: "Mostrando",
            of: "de",
            results: "recomendaciones",
            loadMore: "Cargar más (+5)",
            loading: "Cargando..."
        }
    },
    en: {
        translation: {
            // Header
            title: "DonDisco",
            subtitle: "Discover your next favorite artist with AI",
            
            // Artist Search
            searchArtists: "Search Artists",
            searchPlaceholder: "Type at least 3 characters...",
            maxArtistsReached: "Maximum artists reached",
            selectedArtists: "Selected artists",
            noArtistsSelected: "No artists selected",
            
            // Recommendations
            recommendations: "Recommendations",
            getRecommendations: "Get Recommendations",
            generatingRecommendations: "Generating recommendations...",
            waitingForTastes: "Waiting for your musical tastes!",
            selectArtistsMessage: "Select some artists to get personalized recommendations",
            recommendedArtist: "Recommended artist",
            
            // Errors
            selectAtLeastOne: "Please, select at least one artist",
            serverError: "Error getting recommendations. Is the server running?",
            noArtistsFound: "None of the selected artists were found",
            
            // Theme
            switchToLight: "Switch to light theme",
            switchToDark: "Switch to dark theme",
            
            // Language
            language: "Language",
            spanish: "Español",
            english: "English",
            
            // Pagination
            showing: "Showing",
            of: "of",
            results: "recommendations",
            loadMore: "Load more (+5)",
            loading: "Loading..."
        }
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        debug: false,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'dondisco-language'
        }
    })

export default i18n