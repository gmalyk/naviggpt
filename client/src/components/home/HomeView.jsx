import React from 'react';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import ContentGrid from './ContentGrid';

const HomeView = () => {
    return (
        <main className="flex-grow pt-16 px-6 max-w-6xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <HeroSection />
            <SearchBar />
            <ContentGrid />
        </main>
    );
};

export default HomeView;
