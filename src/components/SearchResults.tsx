import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { SearchContext } from '../Context/SearchContext';
import ResultCard from './ResultCard';

function SearchResults() {
  const { filteredPosts } = useContext(SearchContext);
  return (
    <Box>
      {filteredPosts.map((thisResult) => (
        <ResultCard key={thisResult.postId} postObject={thisResult} />
      ))}
    </Box>
  );
}

export default SearchResults;
