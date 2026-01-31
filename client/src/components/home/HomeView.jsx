import React from 'react';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';
import ContentGrid from './ContentGrid';

const HomeView = () => {
    return (
        <section className="pb-12 px-6 max-w-6xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <HeroSection />
            <SearchBar />
            <ContentGrid />
        </section>
    );
};

export default HomeView;
