import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PostObject } from '../utils/dataObjects';
import { SeasonIcon } from './ResultCard';
import { UserContext } from '../Context/UserContext';
import UserInfoTable from './UserInfoTable';

function ColorSeasonSection({ postObject }: { postObject: PostObject }) {
  const { userDetails } = React.useContext(UserContext);

  return (
    <>
      <Typography id='transition-modal-title' variant='h6' component='h2' align='center'>
        Color Seasons
      </Typography>
      <br />
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SeasonIcon season={userDetails.season} />
          <Typography sx={{ marginLeft: 1 }}>Your color season is {userDetails.season}</Typography>
        </Box>
        <br />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SeasonIcon season={postObject.season} />
          <Typography sx={{ marginLeft: 1 }}>
            The poster&apos;s color season is {postObject.season}
          </Typography>
        </Box>
      </Box>
      <br />
      <a
        style={{ display: 'table', margin: '0 auto' }}
        href='https://30somethingurbangirl.com/find-your-best-colors-mens-edition/'
      >
        What are color seasons?
      </a>
    </>
  );
}

export default function UserInfoScrollDialog({
  open,
  setOpen,
  postObject,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postObject: PostObject;
}) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        scroll='body'
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
        fullScreen={mobileView}
      >
        <AppBar sx={{ position: 'fixed' }}>
          {mobileView && (
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' align='right'>
                User Info Breakdown
              </Typography>
              <IconButton
                edge='start'
                color='inherit'
                onClick={() => setOpen(false)}
                aria-label='close'
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          )}
        </AppBar>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
        <DialogTitle sx={{ textAlign: 'center' }}>Comparison of Post Info vs Your Info</DialogTitle>
        <DialogContent dividers={false} sx={{padding: "0"}}>
          <DialogContent>
            <UserInfoTable postObject={postObject} />
            <br />
            <br />
            <ColorSeasonSection postObject={postObject} />
            <br />
          </DialogContent>
        </DialogContent>
      </Dialog>
    </div>
  );
}
