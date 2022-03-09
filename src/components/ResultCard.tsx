import * as React from 'react';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { Avatar, Chip, Collapse, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { grey } from '@mui/material/colors';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Markdown from './Markdown';
import HeightSVG from '../icons/height-svgrepo-com.svg';
import chestSVG from '../icons/chest.svg';
import beltSVG from '../icons/belt.svg';
import { ReactComponent as SpringLeafSVG } from '../icons/leaf.svg';
import { ReactComponent as AutumnLeafSVG } from '../icons/autumn.svg';
import { ReactComponent as ScalesSVG } from '../icons/scales.svg';
import { PostObject } from '../utils/dataObjects';
import { UserContext } from '../Context/UserContext';
import { LoggingContext } from '../Context/LoggingContext';

function VoteSidePanel() {
  const { addLog } = useContext(LoggingContext);
  const [thumbUpState, setThumbUpState] = React.useState(false);
  const [thumbDownState, setThumbDownState] = React.useState(false);
  return (
    <Box sx={{ backgroundColor: 'rgba(240,240,240,0.5)' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 12,
          lineHeight: '16px',
        }}
      >
        <IconButton
          onClick={() => {
            setThumbUpState((prev) => !prev);
            setThumbDownState(false);
            addLog('clicked thumb up');
          }}
        >
          <ThumbUpOffAltIcon color={thumbUpState ? 'success' : 'disabled'} />
        </IconButton>
        <span>300</span>
        <IconButton
          onClick={() => {
            setThumbDownState((prev) => !prev);
            setThumbUpState(false);
            addLog('clicked thumb down');
          }}
        >
          <ThumbDownOffAltIcon color={thumbDownState ? 'error' : 'disabled'} />
        </IconButton>
      </Box>
    </Box>
  );
}

// eg: "posted by /u/jimmythecode 2 days ago"
function HeaderInfo({ postObject }: { postObject: PostObject }) {
  const { addLog } = useContext(LoggingContext);
  const countryCode =
    typeof postObject?.country === 'string' && postObject.country.length > 0
      ? postObject.country.toLowerCase()
      : 'us';
  return (
    <Box
      sx={{
        color: 'rgb(120, 124, 126)',
        fontSize: 12,
        lineHeight: '28px',
        fontWeight: 500,
        marginLeft: 0.5,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}
    >
      <span>
        Posted by{' '}
        <a
          onPointerDown={() => addLog('onPointerDown u/username link')}
          target='_blank'
          rel='noreferrer'
          href={`https://www.reddit.com/user/${postObject.username}`}
        >
          u/{postObject.username}
        </a>
      </span>
      <span> 2 days ago</span>

      <Box
        component='img'
        src={`https://flagcdn.com/20x15/${countryCode.toLowerCase()}.png`}
        width='20'
        height='15'
        sx={{
          width: '20px',
          height: '15px',
          marginLeft: '8px',
          verticalAligh: 'middle',
        }}
      />
    </Box>
  );
}

function PostInfo({ postObject }: { postObject: PostObject }) {
  const { addLog } = useContext(LoggingContext);
  const [postTextHiddenState, setPostTextHiddenState] = React.useState(false);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          '& svg': {
            width: 28,
            height: 28,
          },
        }}
      >
        <Collapse in={postTextHiddenState} orientation='horizontal'>
          <UnfoldMoreIcon
            sx={{ cursor: 'pointer' }}
            onClick={() => setPostTextHiddenState(false)}
          />
        </Collapse>
        <AccountCircle />
        <HeaderInfo postObject={postObject} />
      </Box>
      {/* Line to collapse post text */}
      <Collapse in={!postTextHiddenState}>
        <Box // Below user icon, username and post date. Contains post and collapse line.
          sx={{
            display: 'grid',
            gridTemplateColumns: '26px 1fr',
          }}
        >
          {/* Reddit line to minimise post */}
          <Box
            sx={{
              width: '100%',
              height: 'calc(100%)',
              cursor: 'pointer',
              marginTop: '4px',
              '&>div': {
                borderLeftStyle: 'solid',
                borderWidth: '2px',
                borderColor: 'lightgrey',
                height: '100%',
                margin: 'auto',
                width: 0,
              },
              '&:hover > div': {
                borderColor: 'rgb(0,121,211)',
              },
            }}
            onClick={() => {
              setPostTextHiddenState(true);
              addLog('clicked expand markdown post line');
            }}
          >
            <div />
          </Box>
          <Box // Markdown reddit post
            sx={{
              fontSize: '0.8rem',
              height: {
                xs: '100px',
                md: '150',
              },
              overflowY: 'scroll',
              overflowX: 'hidden',
              paddingRight: '8px',
              whiteSpace: 'normal',
            }}
          >
            <Markdown markdown={postObject.postText} />
          </Box>
        </Box>
      </Collapse>
    </>
  );
}

function StyleChips({ postObject }: { postObject: PostObject }) {
  const { addLog } = useContext(LoggingContext);
  const arrayOfChips = postObject.tags || [];
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '-10px',
          left: '8px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: 'white',
          padding: '0 8px',
          zIndex: 100,
        }}
      >
        Styles
      </span>
      <Box
        sx={{
          margin: '8px 0',
          padding: '16px',
          bgcolor: 'background.paper',
          border: 1,
          borderRadius: '8px',
          borderColor: grey[400],
          overflow: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {arrayOfChips.map((thisLabel) => (
          <Chip
            key={thisLabel}
            label={thisLabel}
            variant='outlined'
            color='secondary'
            size='small'
            avatar={<Avatar>#</Avatar>}
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => addLog('clicked a chip')}
          />
        ))}
        {arrayOfChips.length === 0 && (
          <Chip
            label='(No style tags have been provided)'
            // variant='outlined'
            variant='outlined'
            color='primary'
            disabled
            size='small'
            // avatar={<Avatar>#</Avatar>}
            sx={
              {
                // visibility: 'hidden',
              }
            }
          />
        )}
      </Box>
    </Box>
  );
}

const seasonCssColor = {
  autumn: 'orange',
  winter: 'blue',
  spring: 'lightgreen',
  summer: 'orangered',
};

const seasonSVGObject = {
  autumn: <AutumnLeafSVG height='24px' fill='currentColor' />,
  winter: <AcUnitIcon fill='currentColor' />,
  spring: <SpringLeafSVG height='24px' fill='currentColor' />,
  summer: <WbSunnyIcon fill='currentColor' />,
};

function SeasonIcon({ season }: { season: keyof typeof seasonCssColor }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        backgroundColor: seasonCssColor[season],
        borderRadius: '50%',
        padding: '4px',
      }}
      title={season}
    >
      {seasonSVGObject[season]}
    </Box>
  );
}

function DifferenceWithArrowOrScales({
  userMeasure,
  posterMeasure,
}: {
  userMeasure: number;
  posterMeasure: number;
}) {
  function getColorBasedOnDifference(difference: number): string {
    if (Math.abs(difference) <= 1) return 'green';
    if (Math.abs(difference) <= 3) return 'orange';
    return 'red';
  }

  const difference = posterMeasure - userMeasure;
  // If measures are equal, we want green scales and 0cm
  if (difference === 0) {
    return (
      <>
        <span>{difference}cm</span>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: getColorBasedOnDifference(difference),
            padding: '4px',
          }}
        >
          <ScalesSVG
            height='24px'
            width='24px'
            fill='currentColor'
            title="user measures and poster's measures are the same"
          />
        </Box>
      </>
    );
  }
  // If poster is bigger than user, then we have positive value
  if (difference > 0) {
    return (
      <>
        <span>{difference}cm</span>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: getColorBasedOnDifference(difference),
            padding: '4px',
          }}
        >
          <ArrowUpwardIcon
            height='24px'
            fill='currentColor'
            titleAccess="poster's measures are greater than your measures"
          />
        </Box>
      </>
    );
  }
  return (
    <>
      <span>{difference}cm</span>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: getColorBasedOnDifference(difference),
          padding: '4px',
        }}
      >
        <ArrowDownwardIcon
          height='24px'
          fill='currentColor'
          titleAccess="poster's measures are smaller than your measures"
        />
      </Box>
    </>
  );
}

function UserInfo({ postObject }: { postObject: PostObject }) {
  // Panel with Height, Chest, Waist measures and Season
  const { userDetails } = React.useContext(UserContext);
  const { addLog } = useContext(LoggingContext);
  return (
    <Box
      sx={{
        margin: {
          xs: '0 0',
          md: '8px 0',
        },
        bgcolor: 'background.paper',
        border: 1,
        borderRadius: '8px',
        borderColor: grey[400],
        position: 'relative',
      }}
      onClick={() => addLog('clicked userInfo panel')}
    >
      <span
        style={{
          position: 'absolute',
          top: '-10px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: 'white',
          padding: '0 8px',
          marginLeft: '8px',
        }}
      >
        User Info
      </span>
      <Box
        sx={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          padding: '16px',
          '::-webkit-scrollbar': {
            // width: "6px",
          },
          '::-webkit-scrollbar-track': {
            // background: "black",
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            '& span': {
              fontWeight: '600',
              fontSize: '0.8rem',
              marginLeft: '8px',
            },
            minWidth: 'min-content',
          }}
        >
          {/* Height */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <img src={HeightSVG} alt='height' style={{ height: '32px' }} />
            <DifferenceWithArrowOrScales
              userMeasure={userDetails.measurements.height}
              posterMeasure={postObject.height}
            />
          </Box>
          {/* Chest */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <img src={chestSVG} alt='chest' style={{ height: '32px' }} />
            <DifferenceWithArrowOrScales
              userMeasure={userDetails.measurements.chest}
              posterMeasure={postObject.chest}
            />
          </Box>
          {/* Waist */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            <img src={beltSVG} alt='belt' style={{ height: '32px' }} />
            <DifferenceWithArrowOrScales
              userMeasure={userDetails.measurements.waist}
              posterMeasure={postObject.waist}
            />
          </Box>
          <Box // Season Icon
            onMouseEnter={() => addLog('onMouseEnter over SeasonIcon')}
          >
            <SeasonIcon season={postObject.season} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function InfoSection({ postObject }: { postObject: PostObject }) {
  return (
    <CardContent
      sx={{
        padding: '8px 8px',
        overflow: 'hidden',
      }}
    >
      <PostInfo postObject={postObject} />
      <br />
      <StyleChips postObject={postObject} />
      <br />
      <UserInfo postObject={postObject} />
    </CardContent>
  );
}

function ResultCard({ postObject }: { postObject: PostObject }) {
  const imageUrl = postObject.images[0];
  const imageUrlExtention = imageUrl.split('.').pop() === 'jpg' ? imageUrl : `${imageUrl}.jpg`;

  return (
    <Box sx={{ minWidth: 275, marginBottom: 1.5 }}>
      <Card
        variant='outlined'
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gridTemplateRows: {
            xs: '1fr 350px',
            md: '1fr',
          },
        }}
      >
        <Box // Vote thumbs and Info Section (post and user info)
          sx={{ display: 'grid', gridTemplateColumns: '1fr 19fr' }}
        >
          <VoteSidePanel />
          <InfoSection postObject={postObject} />
        </Box>
        <Box // Post Images
          sx={{
            backgroundColor: '#3c424b',
            textAlign: 'center',
            overflow: 'hidden',
            gridColumn: {
              // xs: 1,
              md: 2,
            },
            gridRow: {
              xs: 1,
            },
            // gridColumnStart: 1,
          }}
          component='a'
          href={postObject.postUrl.length > 0 ? postObject.postUrl : postObject.images[0]}
          target='_blank'
          rel='noreferrer'
        >
          <Box
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
            src={imageUrlExtention}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default React.memo(ResultCard)