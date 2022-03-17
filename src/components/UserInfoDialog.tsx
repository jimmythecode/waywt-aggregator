import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { PostObject } from '../utils/dataObjects';
import { DifferenceWithArrowOrScales, SeasonIcon } from './ResultCard';
import { UserContext, UserMeasurements } from '../Context/UserContext';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction='up' ref={ref} {...props} />
);

export default function UserInfoDialog({
  open,
  setOpen,
  postObject,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postObject: PostObject;
}) {
  const { userDetails } = React.useContext(UserContext);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <br /> <br />
          <Typography id='transition-modal-title' variant='h6' component='h2' align='center'>
            Comparison of Post Info vs Your Info
          </Typography>
          <br />
          <TableContainer component={Paper}>
            <Table
              sx={{
                xs: {
                  maxWidth: '95%',
                },
                sm: {
                  minWidth: 650,
                },
              }}
              aria-label='simple table'
            >
              <TableHead>
                <TableRow>
                  <TableCell> </TableCell>
                  <TableCell align='right'>Poster&apos;s Details</TableCell>
                  <TableCell align='right'>Your Details</TableCell>
                  <TableCell align='right'>Difference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['height', 'chest', 'waist'].map((thisLabel1) => {
                  const thisLabel = thisLabel1 as keyof UserMeasurements;
                  return (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        component='th'
                        scope='row'
                        sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                      >
                        {thisLabel}
                      </TableCell>
                      <TableCell align='right'>{postObject[thisLabel]}</TableCell>
                      <TableCell align='right'>{userDetails.measurements[thisLabel]}</TableCell>
                      <TableCell
                        align='right'
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}
                      >
                        <DifferenceWithArrowOrScales
                          userMeasure={userDetails.measurements[thisLabel]}
                          posterMeasure={postObject[thisLabel]}
                          showDifference
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          <Typography id='transition-modal-title' variant='h6' component='h2' align='center'>
            Color Season
          </Typography>
          <br />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SeasonIcon season={userDetails.season} />
              <Typography sx={{ marginLeft: 1 }}>
                Your color season is {userDetails.season}
              </Typography>
            </Box>
            <br />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SeasonIcon season={postObject.season} />
              <Typography sx={{ marginLeft: 1 }}>
                The poster&apos;s color season is {postObject.season}
              </Typography>
            </Box>
          </Box>{' '}
          <br />
          <a
            style={{ display: 'table', margin: '0 auto' }}
            href='https://30somethingurbangirl.com/find-your-best-colors-mens-edition/'
          >
            What are color seasons?
          </a>
        </Box>
      </Dialog>
    </div>
  );
}
