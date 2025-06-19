import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';


const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(4)
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10]
  }
}));

interface Feature {
  title: string;
  description: string;
}

const MainPage: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Interactive Courses',
      description: 'Engage with dynamic content and real-time feedback'
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators'
    },
    {
      title: 'Flexible Learning',
      description: 'Study at your own pace, anywhere, anytime'
    }
  ];

  return (
    <>
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to E-Learning Platform
          </Typography>
          <Typography variant="h5" paragraph>
            Transform your future with our cutting-edge online learning platform
          </Typography>
          <Box mt={4}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="inherit"
              size="large"
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us?
        </Typography>        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mt: 2 }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <FeatureCard elevation={3}>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </FeatureCard>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default MainPage;
