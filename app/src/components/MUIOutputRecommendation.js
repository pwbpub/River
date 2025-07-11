import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Rating,
    Collapse,
    useTheme
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import Flickity from 'flickity';
import 'flickity/css/flickity.css';

const BookCard = ({ book, onResize }) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandClick = () => {
        setIsExpanded(prev => !prev);
    };

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };
    
    const formatRatingsText = (rating, count) => {
        if (rating && count) {
            return `${rating.toFixed(1)} • ${count.toLocaleString()} voters`;
        }
        return 'Rating not available';
    };

    return (
        <Card
            className="carousel-cell"
            sx={{
                width: 650,
                minHeight: 'auto',
                bgcolor: theme.palette.primary.light2,
                boxShadow: 4,
                borderRadius: 2,
                mx: 1,
                mb: 3, 
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box 
                        sx={{ 
                            flexShrink: 0, 
                            width: 160
                        }}
                    >
                        <Box 
                            sx={{ 
                                position: 'relative',
                                width: 140,
                                height: 210,
                                mb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    width: 140,
                                    height: 210,
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    borderRadius: 1,
                                    zIndex: 0
                                }}
                            />
                            {book.coverImage ? (
                                <img
                                    src={book.coverImage}
                                    alt={`Cover of ${book.title}`}
                                    style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        width: 140,
                                        height: 210,
                                        objectFit: 'cover',
                                        borderRadius: 4,
                                        border: '1px solid #ddd',
                                        backgroundColor: 'white'
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        width: 140,
                                        height: 210,
                                        bgcolor: theme.palette.primary.light,
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', p: 1 }}>
                                        No Cover Available
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ width: 140, fontSize: '0.8rem' }}>
                            <Typography variant="caption" display="block" sx={{ mb: 0.4, fontWeight: 'bold' }}>
                                <strong>Genre:</strong> {book.genre || 'Fiction'}
                            </Typography>
                            {/* MODIFIED: Changed to show the single "First Published" date */}
                            <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                <strong>First Published:</strong> {book.originalYear || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                <strong>Pages:</strong> {book.pageCount || 'Unknown'}
                            </Typography>

                            <Collapse 
                                in={isExpanded} 
                                timeout="auto" 
                                unmountOnExit
                                onEntered={onResize}
                                onExited={onResize}
                            >
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                        <strong>Publisher:</strong> {book.publisher || 'Unknown'}
                                    </Typography>
                                    {book.isbn && (
                                        <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                            <strong>ISBN:</strong> {book.isbn}
                                        </Typography>
                                    )}
                                </Box>
                            </Collapse>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography 
                                variant="h5" 
                                component="h3"
                                sx={{ 
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto Slab',
                                    mb: 0.5,
                                    color: theme.palette.primary.dark,
                                    lineHeight: 1.2
                                }}
                            >
                                {book.title}
                            </Typography>
                            <Typography 
                                variant="subtitle1"
                                sx={{ 
                                    fontFamily: 'Roboto',
                                    color: 'text.secondary',
                                    mb: 1,
                                    fontSize: '1.1rem'
                                }}
                            >
                                by {book.author}
                            </Typography>
                            
                            {book.averageRating && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Rating 
                                        value={book.averageRating} 
                                        precision={0.1} 
                                        readOnly 
                                        size="small" 
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {formatRatingsText(book.averageRating, book.ratingsCount)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(215, 94, 92, 0.08)', borderRadius: 1, borderLeft: '4px solid', borderLeftColor: theme.palette.secondary.main }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    mb: 1,
                                    fontSize: '0.9rem',
                                    color: theme.palette.secondary.main,
                                    fontFamily: 'Roboto Slab'
                                }}
                            >
                                Why this book was recommended:
                            </Typography>
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    fontFamily: 'EB Garamond',
                                    fontSize: '1rem',
                                    lineHeight: 1.5
                                }}
                            >
                                {book.reason || 'Based on your reading preferences.'}
                            </Typography>
                        </Box>

                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontStyle: 'italic',
                                fontFamily: 'EB Garamond',
                                lineHeight: 1.6,
                                mb: 2,
                                fontSize: '0.95rem'
                            }}
                        >
                            {isExpanded 
                                ? book.description || 'No description available.'
                                : truncateText(book.description || 'No description available.', 150)
                            }
                        </Typography>

                        <Button
                            onClick={handleExpandClick}
                            endIcon={<ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />}
                            sx={{ alignSelf: 'flex-start', color: theme.palette.secondary.main, fontWeight: 'bold', mb: 1 }}
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                    </Box>
                </Box>

                <Collapse 
                    in={isExpanded} 
                    timeout="auto" 
                    unmountOnExit
                    onEntered={onResize}
                    onExited={onResize}
                >
                    {book.amazonLink && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                href={book.amazonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: '#ff9900',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    px: 3,
                                    py: 1,
                                    '&:hover': { bgcolor: '#ffb732' }
                                }}
                            >
                                View/Purchase on Amazon
                            </Button>
                        </Box>
                    )}
                </Collapse>
            </CardContent>
        </Card>
    );
};

// The rest of MUIOutputRecommendation remains the same
const MUIOutputRecommendation = ({ recommendations, error }) => {
    const theme = useTheme();
    const carouselRef = useRef(null);
    const flickityRef = useRef(null);

    const handleCarouselResize = useCallback(() => {
        setTimeout(() => {
            if (flickityRef.current) {
                flickityRef.current.resize();
            }
        }, 150);
    }, []);

    useEffect(() => {
        if (recommendations && recommendations.length > 0 && carouselRef.current) {
            if (!flickityRef.current) {
                flickityRef.current = new Flickity(carouselRef.current, {
                    cellAlign: 'center',
                    wrapAround: true,
                    autoPlay: false,
                    prevNextButtons: true,
                    pageDots: false,
                    adaptiveHeight: true,
                    draggable: true,
                    freeScroll: false,
                    groupCells: false,
                    lazyLoad: false,
                    selectedAttraction: 0.025,
                    friction: 0.28
                });
            } else {
                flickityRef.current.reloadCells();
                flickityRef.current.select(0);
            }

            return () => {
                if (flickityRef.current) {
                    flickityRef.current.destroy();
                    flickityRef.current = null;
                }
            };
        }
    }, [recommendations]);

    if (error) {
        return (
            <Paper
                elevation={3}
                sx={{ maxWidth: 700, mx: 'auto', mt: 4, mb: 6, p: 3, borderRadius: 2, bgcolor: theme.palette.error.main, color: 'white' }}
            >
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            </Paper>
        );
    }

    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: { xs: '98%', sm: '90%', md: '75%', lg: '60rem', xl: '52rem' },
                mx: 'auto', pt: 3, px: 1, pb: 3, borderRadius: 2, bgcolor: theme.palette.primary.main2
            }}
        >
            <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: 600, color: theme.palette.secondary.main, textAlign: 'center', pb: 1, borderBottom: '2px solid rgba(230, 164, 163, 0.75)', mb: 4, fontFamily: 'Roboto Slab' }}
            >
                Recommended Books
            </Typography>
            <Box
                ref={carouselRef}
                className="main-carousel"
                sx={{
                    '& .flickity-prev-next-button': { width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
                    '& .flickity-prev-next-button:hover': { backgroundColor: '#f5f5f5' },
                    '& .flickity-prev-next-button .arrow': { fill: '#333' }
                }}
            >
                {recommendations.map((book, index) => (
                    <BookCard 
                        key={index}
                        book={book}
                        onResize={handleCarouselResize}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default MUIOutputRecommendation;