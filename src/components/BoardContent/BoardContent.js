import Column from 'components/Column/Column'
import './BoardContent.scss'

import React, { useState, useEffect, useRef } from 'react'
import { initialData } from 'actions/initialData'
import { isEmpty } from 'lodash'
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
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if (boardFromDB) {
            setBoard(boardFromDB)

            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
        }
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
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null ) {
            let newColumns = [...columns]

            let currentColumn = newColumns.find(c => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id)

            setColumns(newColumns)
        }
    }

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }
        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5), //demo, random string có 5 kí tự ngẫu nhiên
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }
        let newColumns = [...columns]
        newColumns.push(newColumnToAdd)

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
        setnewColumnTitle('')
        toggleOpenNewColumnForm()
    }

    const onUpdateColumn = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id

        let newColumns = [...columns]
        const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)

        if (newColumnToUpdate._destroy) {
            //remove column
            newColumns.splice(columnIndexToUpdate, 1)
        } else {
            //update column info
            newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
        }

        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
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
                        onUpdateColumn={onUpdateColumn}/>
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