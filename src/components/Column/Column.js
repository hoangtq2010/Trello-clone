import Card from 'components/Card/Card'
import React, { useEffect, useRef, useState } from 'react'
import './Column.scss'

import { mapOrder } from '../../utilities/sorts'

import { Container, Draggable } from 'react-smooth-dnd'

import { Dropdown, Form, Button } from 'react-bootstrap'
import ConfirmModal from '../../components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInLineText } from '../../utilities/contentEdittable'
import { cloneDeep } from 'lodash'

import { createNewCard, updateColumn } from '../../actions/ApiCall/index'

function Column(props) {
    const { column, onCardDrop, onUpdateColumnState } = props //data tu cha->con
    const cards = mapOrder(column.cards, column.cardOrder, '_id')

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

    const [columnTitle, setColumnTitle] = useState('')
    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    // Remove column
    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }
            // Call api update column
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                onUpdateColumnState(updatedColumn)
            })
        }
        toggleShowConfirmModal()
    }

    // Update column title
    const handleColumnTitleBlur = () => {
        if (columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle
            }
            // Call api update column
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                updatedColumn.cards = newColumn.cards
                onUpdateColumnState(updatedColumn)
            })
        }

    }

    const [openNewCardForm, setOpenNewCardForm] = useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardInputRef = useRef(null)
    useEffect( () => {
        if (newCardInputRef && newCardInputRef.current) {
            newCardInputRef.current.focus()
            newCardInputRef.current.select()
        }
    }, [openNewCardForm])

    const [newCardTitle, setnewCardTitle] = useState('')
    const onNewCardTitleChange = (e) => setnewCardTitle(e.target.value)

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardInputRef.current.focus()
            return
        }
        const newCardToAdd = {
            boardId: column.boardId,
            title: newCardTitle.trim(),
            columnId: column._id
        }

        // Call API
        createNewCard(newCardToAdd).then(card => {
            let newColumn = cloneDeep(column)
            newColumn.cards.push(card)
            newColumn.cardOrder.push(card._id)

            onUpdateColumnState(newColumn)
            setnewCardTitle('')
            toggleOpenNewCardForm()
        })
    }

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        className="trello-content-editable"
                        value={columnTitle}
                        onChange={handleColumnTitleChange}
                        onBlur={handleColumnTitleBlur}
                        onKeyDown={saveContentAfterPressEnter}
                        onClick={selectAllInLineText}
                        onMouseDown={e => e.preventDefault()}
                        spellCheck="false"
                    />
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn" />

                        <Dropdown.Menu>
                            <Dropdown.Item>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
                            <Dropdown.Item>Move all cards in this column(beta)...</Dropdown.Item>
                            <Dropdown.Item>Archive all cards in this column(beta)...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div className="card-list">
                <Container
                    orientation="vertical" //default
                    groupName="hoangkissdev-columns"
                    onDrop={dropResult => onCardDrop(column._id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card}/>
                        </Draggable>
                    ))}
                </Container>
                {openNewCardForm &&
                    <div className="add-new-card-area">
                    <Form.Control
                        size="sm"
                        as="textarea"
                        placeholder="Enter a title for this card..."
                        className="textarea-enter-new-column"
                        ref={newCardInputRef} //m??? ra t??? ?????ng focus v??o inpput
                        value={newCardTitle}
                        onChange={onNewCardTitleChange}
                        onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                    />
                    </div>
                }
            </div>
            <footer>
                {openNewCardForm &&
                    <div className="add-new-card-actions">
                        <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
                        <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                            <i className="fa fa-trash icon"></i>
                        </span>
                    </div>
                }
                {!openNewCardForm &&
                    <div className="footer-actions" onClick={toggleOpenNewCardForm}>
                        <i className="fa fa-plus icon" />Add another card
                    </div>
                }
            </footer>

            <ConfirmModal
                show={showConfirmModal}
                onAction={onConfirmModalAction}
                title="Remove column"
                content={`Are you sure you want to remove <strong>${column.title}</strong>.<br /> All related cards will also be removed `}
            />
        </div>
    )
}

export default Column