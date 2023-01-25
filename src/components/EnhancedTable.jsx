import * as React from "react";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import "./table.css";
import SearchIcon from "@mui/icons-material/Search";

import EditPage from "./EditPage";

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "Ids",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "role",
    numeric: true,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead({onSelectAllClick,numSelected, rowCount}) {
  


  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell align="right" key={headCell.id}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ numSelected, selected, rows, setRows, active, setActive }) {
  const selectedDelete = (selected, e) => {
    let res = rows;
   // eslint-disable-next-line
    selected.map((id) => {
        // eslint-disable-next-line
      res = res.filter((row) => row.id != id);
    });
    setRows(res);
    setActive(!active)
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 && (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>

          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon
                style={{ color: "red" }}
                onClick={(e) => {
                  selectedDelete(selected, e);
                }}
              />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}



export default function EnhancedTable() {
  const [rows, setRows] = useState([]);
  //  const [alldata, setAlldata]= useState([])

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [query, setQuery] = useState("");

  const [editpageOpen, setEditpageOpen] = useState(false);
  const [editData, setEditData] = useState("");

  const [active, setActive]= useState(false)

  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((res) => setRows(res))

      .catch((err) => console.error(err));
  }, []);



  // <-----------sELECT AND DELETE---------------------->
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      let seeIdx= page*rowsPerPage
      let arr= rows.slice(seeIdx, rowsPerPage+seeIdx)
    
      const newSelected = ((arr)).map((n) => n.id);
      setSelected(newSelected);
      setActive(!active)
      return;
    }
   
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setActive(true)
  };


  // <-------------PAGE CHANGE--------------->
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // <--------------------EDIT AND DELETE-------------------------------------------->

  const handleEdit = (idx, e) => {
    console.log("editr");
    const res = rows.filter((row) => row.id === idx);
    setEditData(res);
    setEditpageOpen(!editpageOpen);
    e.stopPropagation();
  };

  const handleDelete = (idx, e) => {
    // console.log("deleted", idx)
    const res = rows.filter((row) => row.id !== idx);
    setRows(res);
   
    e.stopPropagation();
  };

  //<------------------------------- search function  -------------------------->
  function handleSearch(query) {
    const filteredResults = rows?.filter((item) => {
      return (
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.email.toLowerCase().includes(query.toLowerCase()) ||
        item.role.toLowerCase().includes(query.toLowerCase())
      );
    });
    setRows(filteredResults);
    setQuery("");
    // eslint-disable-next-line
    if (query == "") {
      window.location.reload();
    }
  }

  // console.log("first", selected);

  return (
    <>
      <Box sx={{ width: "95%", margin: "auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
          <input
            style={{
              border: "none",
              outline: "none",
              borderBottom: "2px solid grey",
            }}
            type="text"
            placeholder="Enter your search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon onClick={() => handleSearch(query)} />
        </div>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
               
              />
              <TableBody>
                {rows
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row?.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
                        <>
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">{row.id}</TableCell>
                            <TableCell align="right">{row.name}</TableCell>

                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.role}</TableCell>

                            <TableCell align="right">
                              <EditIcon
                                onClick={(e) => handleEdit(row.id, e)}
                                style={{ color: "blue", cursor: "pointer" }}
                                className="btn"
                              />
                              <DeleteIcon
                                onClick={(e) => handleDelete(row.id, e)}
                                style={{ color: "red", cursor: "pointer" }}
                                className="btn"
                              />
                            </TableCell>
                          </TableRow>
                        </>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      { active&& <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setRows={setRows}
          rows={rows}
          active={active}
          setActive={setActive}
        />}
        {editpageOpen && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: "0",
              background: "rgba(0, 0, 0, 0.716)",
            }}
          >
            <EditPage
              setEditpageOpen={setEditpageOpen}
              editData={editData}
              rows={rows}
              setRows={setRows}
            />
          </div>
        )}
      </Box>
    </>
  );
}
