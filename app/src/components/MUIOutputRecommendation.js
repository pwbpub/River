import React, { useState, useEffect, useRef, useCallback } from 'react'; // MODIFIED: Imported useCallback
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

// ====================================================================
// BookCard now accepts an `onResize` prop to communicate with the parent
// ====================================================================
const BookCard = ({ book, onResize }) => { // MODIFIED: Accepted onResize prop
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
        if (!rating || !count) return 'No ratings available';
        return `${rating.toFixed(1)} • ${count.toLocaleString()} voters`;
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
                mx: 1
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Main Layout: Image + Details on Left, Content on Right */}
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    {/* Left Side - Book Cover with Details Below */}
                    <Box 
                        sx={{ 
                            flexShrink: 0, 
                            width: 160
                        }}
                    >
                        {/* Book Cover with Shadow Effect */}
                        <Box 
                            sx={{ 
                                position: 'relative',
                                width: 140,
                                height: 210,
                                mb: 2
                            }}
                        >
                            {/* Shadow Box Behind Image */}
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
                            
                            {/* Book Cover */}
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

                        {/* Book Details Under Image */}
                        <Box sx={{ width: 140, fontSize: '0.8rem' }}>
                            {/* Always Visible Details */}
                            <Typography variant="caption" display="block" sx={{ mb: 0.4, fontWeight: 'bold' }}>
                                <strong>Genre:</strong> {book.genre || 'Fiction'}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                <strong>Published:</strong> {book.publishedDate || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                <strong>Pages:</strong> {book.pageCount || 'Unknown'}
                            </Typography>

                            {/* Expandable Details */}
                            {/* MODIFIED: Added onEntered and onExited to trigger the resize callback */}
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
                                    {book.language && book.language !== 'en' && (
                                        <Typography variant="caption" display="block" sx={{ mb: 0.4 }}>
                                            <strong>Language:</strong> {book.language.toUpperCase()}
                                        </Typography>
                                    )}
                                </Box>
                            </Collapse>
                        </Box>
                    </Box>

                    {/* Right Side - Main Content */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Title and Author Section */}
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
                            
                            {/* Rating Stars */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Rating 
                                    value={book.averageRating || 4.0} 
                                    precision={0.1} 
                                    readOnly 
                                    size="small" 
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {formatRatingsText(book.averageRating, book.ratingsCount)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* LLM Reasoning */}
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
                                {book.reason || 'Based on your reading preferences, this book offers similar themes and writing style.'}
                            </Typography>
                        </Box>

                        {/* Book Description */}
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
                                : truncateText(book.description || 'No description available.', 120)
                            }
                        </Typography>

                        {/* Expand/Collapse Button */}
                        <Button
                            onClick={handleExpandClick}
                            endIcon={
                                <ExpandMoreIcon 
                                    sx={{ 
                                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s'
                                    }} 
                                />
                            }
                            sx={{ 
                                alignSelf: 'flex-start',
                                color: theme.palette.secondary.main,
                                fontWeight: 'bold',
                                mb: 1
                            }}
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                        </Button>
                    </Box>
                </Box>

                {/* Expanded Content */}
                {/* MODIFIED: Added onEntered and onExited to the second Collapse component */}
                <Collapse 
                    in={isExpanded} 
                    timeout="auto" 
                    unmountOnExit
                    onEntered={onResize}
                    onExited={onResize}
                >
                    {/* Amazon Purchase Link */}
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
                                    '&:hover': {
                                        bgcolor: '#ffb732',
                                    }
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


const MUIOutputRecommendation = ({ recommendations, error }) => {
    const theme = useTheme();
    const carouselRef = useRef(null);
    const flickityRef = useRef(null);

    // ADDED: Created a stable resize handler with useCallback
    const handleCarouselResize = useCallback(() => {
        if (flickityRef.current) {
            flickityRef.current.resize();
        }
    }, []);

    useEffect(() => {
        if (recommendations && recommendations.length > 0 && carouselRef.current) {
            if (!flickityRef.current) {
                flickityRef.current = new Flickity(carouselRef.current, {
                    cellAlign: 'center',
                    wrapAround: true,
                    autoPlay: false,
                    prevNextButtons: true,
                    pageDots: true,
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
                sx={{
                    maxWidth: 700,
                    mx: 'auto',
                    mt: 4,
                    mb: 6,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.error.main,
                    color: 'white'
                }}
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
                maxWidth: {
                  xs: '98%',
                  sm: '90%',
                  md: '75%',
                  lg: '60%rem',
                  xl: '52%rem',
                },
                mx: 'auto',
                mt: 4,
                pt: 3,
                pl: 1,
                pr: 1,
                pb: 1,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main2
            }}
        >
            {/* Header */}
            <Typography
                variant="h5"
                component="h3"
                sx={{
                    fontWeight: 600,
                    color: theme.palette.secondary.main,
                    textAlign: 'center',
                    pb: 1,
                    borderBottom: '2px solid rgba(230, 164, 163, 0.75)',
                    mb: 4,
                    fontFamily: 'Roboto Slab'
                }}
            >
                Recommended Books
            </Typography>

            {/* Flickity Carousel */}
            <Box
                ref={carouselRef}
                className="main-carousel"
                sx={{
                    '& .flickity-page-dots': {
                        bottom: '-50px'
                    },
                    '& .flickity-page-dots .dot': {
                        width: '12px',
                        height: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: 'none'
                    },
                    '& .flickity-page-dots .dot.is-selected': {
                        backgroundColor: theme.palette.secondary.main
                    },
                    '& .flickity-prev-next-button': {
                        width: '50px',
                        height: '50px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    '& .flickity-prev-next-button:hover': {
                        backgroundColor: '#f5f5f5'
                    },
                    '& .flickity-prev-next-button .arrow': {
                        fill: '#333'
                    }
                }}
            >
                {recommendations.map((book, index) => (
                    // MODIFIED: Passed the onResize prop to each BookCard
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