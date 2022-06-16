import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PostObject } from '../utils/dataObjects';

function PostImages({ postObject }: { postObject: PostObject }) {
  const { imageUrls } = postObject;
  const numberOfImages = imageUrls.length;
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <Box // anchor element
      sx={{
        position: 'relative',
        backgroundColor: '#3c424b',
        textAlign: 'center',
        overflow: 'hidden',
        gridColumn: {
          md: 2,
        },
        gridRow: {
          xs: 1,
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      component='a'
      href={postObject.permalink.length > 0 ? postObject.permalink : postObject.imageUrls[0]}
      target='_blank'
      rel='noreferrer'
    >
      <Box // img element
        component='img'
        sx={{
          height: {
            xs: 300,
            md: 350,
            lg: 400,
          },
          verticalAlign: 'middle',
        }}
        alt='postImage'
        src={postObject.imageUrls[imageIndex]}
      />
      {/* Arrows */}
      <IconButton
        aria-label='prev-image'
        size='large'
        sx={{
          left: 0,
          position: 'absolute',
          height: '100%',
          borderRadius: 0,
          '&:hover': { color: 'silver' },
          '&:disabled': { display: 'none' },
        }}
        onClick={(e) => {
          e.preventDefault();
          setImageIndex((prev) => Math.max(prev - 1, 0));
        }}
        disabled={imageIndex < 1}
      >
        <KeyboardArrowLeftIcon fontSize='inherit' />
      </IconButton>
      <IconButton
        aria-label='prev-image'
        size='large'
        sx={{
          right: 0,
          position: 'absolute',
          height: '100%',
          borderRadius: 0,
          '&:hover': { color: 'silver' },
          '&:disabled': { display: 'none' },
        }}
        onClick={(e) => {
          e.preventDefault();
          setImageIndex((prev) => Math.min(prev + 1, numberOfImages - 1));
        }}
        disabled={imageIndex === numberOfImages - 1}
      >
        <KeyboardArrowRightIcon fontSize='inherit' />
      </IconButton>
     {/* <IconButton
        aria-label='prev-image'
        size='large'
        sx={{
          right: 0,
          position: 'absolute',
          height: '100%',
          borderRadius: 0,
          '&.Mui-disabled': { color: 'blue' },
          '&:disabled': { color: 'red' },
        }}
        disabled
      >
        <KeyboardArrowRightIcon fontSize='inherit' />
      </IconButton> */}
    </Box>
  );
}

export default PostImages;
