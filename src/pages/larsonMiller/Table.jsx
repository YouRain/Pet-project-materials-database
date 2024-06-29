import React, { useMemo, useState } from "react";
import { MRT_EditCellTextField, MaterialReactTable, useMaterialReactTable } from "material-react-table";
import './TableLM.css';

function Table({ dataPoints, setDataPoints }) {

    const [editedUsers, setEditedUsers] = useState("");

    const columns = useMemo(
        () => [
            {
                header: "Прямая",
                accessorKey: "straight",
                maxSize: "80",
                enableEditing: false,
                Cell: ({ cell, column, renderedCellValue, row, table }) =>
                (<span className="input-straight__container">
                    <input
                        className="input-straight"
                        type="checkbox"
                        value="0"
                        // defaultChecked={cell.row.original[cell.column.id]}
                        checked={cell.getValue()}
                        onChange={(e) => {
                            !e.target.checked ? cell.row.original[cell.column.id] = 0 : cell.row.original[cell.column.id] = 1
                            const updatedData = [...dataPoints];
                            updatedData[cell.row.index] = row.original
                            setDataPoints(updatedData)
                        }
                        }
                    /></span>)
                ,
                sortingFn: (rowA, rowB) => {
                    return rowA.original.straight - rowB.original.straight
                },
            },
            {
                header: "Кривая",
                accessorKey: "curve",
                maxSize: "80",
                enableEditing: false,
                Cell: ({ cell, row }) =>
                (<span className="input-straight__container">
                    <input
                        className="input-straight"
                        type="checkbox"
                        value="1"
                        // defaultChecked={cell.getValue()}
                        checked={cell.getValue()}
                        onChange={(e) => {
                            !e.target.checked ? cell.row.original[cell.column.id] = 0 : cell.row.original[cell.column.id] = 1
                            const updatedData = [...dataPoints];
                            updatedData[cell.row.index] = row.original
                            setDataPoints(updatedData)
                        }
                        }
                    /></span>)
                ,
                sortingFn: (rowA, rowB) => {
                    return rowA.original.straight - rowB.original.straight
                },
            },
            {
                header: "T",
                accessorKey: "temperature",
                maxSize: "80",
                sortingFn: myCustomSortingFn,
                muiEditTextFieldProps: ({ cell, row, }) => ({
                    sx: {
                        // margin: 0,
                        // p: 0,
                        // border: 0,
                        // fontWeight: 'bold',
                        // fontSize: 5,
                        // textAlign: "center",
                    },
                    onChange: (e) => {
                        setEditedUsers(e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
                    },
                    onBlur: (e) => {
                        const updatedData = [...dataPoints];
                        updatedData[cell.row.index] = { ...row.original, temperature: e.target.value }
                        setDataPoints(updatedData)
                    },
                })
            },
            {
                header: "\u03c4",
                accessorKey: "time",
                maxSize: "80",
                sortingFn: myCustomSortingFn,
                muiEditTextFieldProps: ({ cell, row, }) => ({
                    onChange: (e) => {
                        setEditedUsers(e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
                    },
                    onBlur: (e) => {
                        const updatedData = [...dataPoints];
                        updatedData[cell.row.index] = { ...row.original, time: e.target.value }
                        setDataPoints(updatedData)
                    },
                }),
            },
            {
                header: "\u03C3",
                accessorKey: "strength",
                maxSize: "100",
                sortingFn: myCustomSortingFn,
                muiEditTextFieldProps: ({ cell, row, }) => ({
                    onChange: (e) => {
                        setEditedUsers(e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
                    },
                    onBlur: (e) => {
                        const updatedData = [...dataPoints];
                        updatedData[cell.row.index] = { ...row.original, strength: e.target.value }
                        setDataPoints(updatedData)
                    },
                }),
            },
            {
                header: "lg(\u03C3)",
                accessorKey: "logStrength",
                maxSize: "80",
                sortingFn: myCustomSortingFn,
                enableEditing: false,
            },
            {
                header: "P",
                accessorKey: "parametrLM",
                maxSize: "80",
                sortingFn: myCustomSortingFn,
                enableEditing: false,
            },
        ], [dataPoints])



    const table = useMaterialReactTable({
        columns,
        data: dataPoints,
        enableTopToolbar: false, //Отключаем верхний тулбар
        enableBottomToolbar: false, //Отключаем нижний тулбар
        enablePagination: false, //Отключаем пагинацию
        muiTableBodyRowProps: { hover: false }, //Отключаем ховер эффект
        enableGlobalFilter: false, //Отключаем глобальный фильтер
        positionActionsColumn: "right", //Расположение кнопок "Редактирование" и "Удаление"
        // mrtTheme: (theme) => ({
        //     baseBackgroundColor: theme.palette.background.default, //change default background color
        // }),
        enableRowSelection: false,
        editDisplayMode: 'cell',
        enableEditing: true,
        enableStickyHeader: true,
        enableColumnResizing: false,
        enableColumnActions: false, //Отключаем кнопку "Многоточия" у каждого столбца
        enableCellActions: false,
        enableSorting: true,
        enableTableFooter: true,
        state:
        {
            // isSaving: isUpdatingUser,
        },
        // onEditingRowSave: async ({ values, table }) => {
        //     console.log(values)
        //     await updateUser(values);
        //     table.setEditingRow(null);
        // },
        renderEmptyRowsFallback: ({ table }) => ( //Если данных нет
            <div style={{
                height: "100px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <span style={{
                    fontSize: "16px",
                    fontWeight: 'bold',
                    color: "red",
                }}>Нет данных</span>
            </div>
        ),
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                height: "100%",
                borderRight: "1px solid black",
                // position: "absolute",
                // top: 0,
                // bottom: "0",
                // width: "100%",
                boxShadow: "none",
                borderRadius: 0,
            },
        },
        muiTableHeadCellProps: {
            align: 'center',
            sx: {
                padding: 0,
                background: "#efeeee",
                borderBottom: "1px solid black",
                boxShadow: "none",
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
        // muiTableBodyProps: {
        //     sx: {
        //         height: "50%",
        //     }
        // },
        muiTableBodyCellProps: {
            align: 'center',
            sx: {
                padding: 0,
                // background: "#efeeee",
                boxShadow: "none",
                fontWeight: 'normal',
                fontSize: '14px',
            },
        },
        muiEditTextFieldProps: {
            align: 'center',
            // placeholder: "Хуй",
            sx: {
                margin: "0",
                p: 0,
                border: 0,
            },
            onChange: (e) => {
                setEditedUsers(e.target.value = e.target.value.replace(/[^0-9.]/g, ""))
            },
        },
        muiTableFooterProps: {
            sx: {
                height: "50px",
            }
        }
    })

    async function updateUser() {

    }

    function myCustomSortingFn(rowA, rowB, columnId) {
        return rowA.getValue(columnId) - rowB.getValue(columnId)
        // return rowA.getValue(columnId).localeCompare(rowB.getValue(columnId))
    }

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    )
}

export default Table;

// const validateValue = (value) =>
//   !!value.length &&
//   value.toLowerCase()
//     .match(/[0-9]./);
