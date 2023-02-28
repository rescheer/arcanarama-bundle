/* eslint-disable react/prop-types */
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

/**
 * Builds the vibecheck result table
 * @param {object} props
 * @returns A mUI table containing each user's vibecheck result
 */
export default function VibeResultsApp(props) {
  const { vibesData } = props;

  if (typeof vibesData === 'object') {
    return (
      <TableContainer>
        <Table sx={{ width: 1 }} size="small" aria-label="a dense table">
          <TableBody>
            {vibesData.map((row) => (
              <TableRow key={row.user}>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  sx={{ width: '25%', border: 2 }}
                >
                  {row.user}
                </TableCell>
                <TableCell align="left" sx={{ border: 2 }}>
                  {row.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
