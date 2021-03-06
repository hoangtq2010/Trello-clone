import Column from 'components/Column/Column'
import './BoardContent.scss'

import React, { useState, useEffect, useRef } from 'react'
import {
    fetchBoardDetails,
    createNewColumn,
    updateBoard,
    updateColumn,
    updateCard
} from '../../actions/ApiCall'

import { isEmpty, cloneDeep } from 'lodash'
import { mapOrder } from '../../utilities/sorts'

import { Container, Draggable } from 'react-smooth-dnd'

import { applyDrag } from '../../utilities/dragDrop'

import { Container as BootstrapContainer,
    Row, Col, Form, Button }
from 'react-bootstrap'

function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openNewColumnForm, setOpenNewColumnForm] =useState(false)
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

    const newColumnInputRef = useRef(null)
    const [newColumnTitle, setnewColumnTitle] = useState('')
    const onNewColumnTitleChange = (e) => setnewColumnTitle(e.target.value)

    useEffect( () => {
        const boardId = '6161a205d4768f9186fca8db'
        fetchBoardDetails(boardId).then(board => {
            setBoard(board)
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
        })
    }, [])

    useEffect( () => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus()
            newColumnInputRef.current.select()
        }
    }, [openNewColumnForm]) //chạy khi mà giá trị openNewColumnForm thay đổi

    if ( isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color':'red' }}>Board not found!</div>
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = cloneDeep(columns)
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = cloneDeep(board)
        newBoard.columnOrder = newColumns.map(c => c._id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)

        // Call api update columnOrder in board details
        updateBoard(newBoard._id, newBoard).catch(() => {
            setColumns(columns)
            setBoard(board)
        })
    }

    const onCardDrop = (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null ) {
            let newColumns = cloneDeep(columns)

            let currentColumn = newColumns.find(c => c._id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i => i._id)


            setColumns(newColumns)
            if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
                /**
                 * Action: remove card inside its column
                 * 1-Call api update cardOrder in current column
                 */
                updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))
            } else {
                /**
                 * Action: remove card beetween two columns
                 * 1-Call api update cardOrder in current column
                 * 2-Call api update columnId in current card
                 */
                //  1-Call api update cardOrder in current column
                updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))

                if (dropResult.addedIndex !== null) {
                    let currentCard = cloneDeep(dropResult.payload)
                    currentCard.columnId = currentColumn._id
                    // 2-Call api update columnId in current card
                    updateCard(currentCard._id, currentCard)
                }
            }
        }
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }
        const newColumnToAdd = {
            // id: Math.random().toString(36).substr(2, 5), //demo, random string có 5 kí tự ngẫu nhiên
            boardId: board._id,
            title: newColumnTitle.trim()
            // cardOrder: [],
            // cards: []
        }

        // Call API
        createNewColumn(newColumnToAdd).then(column => {
            let newColumns = [...columns]
            newColumns.push(column)

            let newBoard = { ...board }
            newBoard.columnOrder = newColumns.map(c => c._id)
            newBoard.columns = newColumns

            setColumns(newColumns)
            setBoard(newBoard)
            setnewColumnTitle('')
            toggleOpenNewColumnForm()
        })
    }

    const onUpdateColumnState = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate._id

        let newColumns = [...columns]
        const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)

        if (newColumnToUpdate._destroy) {
            //remove column
            newColumns.splice(columnIndexToUpdate, 1)
        } else {
            //update column info
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
        }

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c._id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                dragHandleSelector=".column-drag-handle"
                getChildPayload={index => columns[index]}
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column column={column}
                        onCardDrop={onCardDrop}
                        onUpdateColumnState={onUpdateColumnState}/>
                    </Draggable>
                ))}
            </Container>

            <BootstrapContainer className="trello-container">
                {!openNewColumnForm &&
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
                            <i className="fa fa-plus icon" />Add another card
                        </Col>
                    </Row>
                }
                {openNewColumnForm &&
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
                            <span className="cancel-icon" onClick={toggleOpenNewColumnForm}>
                                <i className="fa fa-trash icon"></i>
                            </span>
                        </Col>
                    </Row>
                }
            </BootstrapContainer>
      </div>
    )
}

export default BoardContent