import React from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from '@mui/material';
import { UserContext, UserMeasurements } from '../Context/UserContext';
import { PostObject } from '../utils/dataObjects';
import { DifferenceWithArrowOrScales } from './ResultCard';


function UserInfoTable({postObject}:{postObject: PostObject}) {
    const { userDetails } = React.useContext(UserContext);


  return (
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
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              key={thisLabel}
            >
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
  </TableContainer>  )
}

export default UserInfoTable