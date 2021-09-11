export const initialData = {
    boards: [
        {
            id: 'board-1',
            columnOder: ['column-1', 'column-2', 'column-3'],
            columns: [
                {
                    id: 'column-1',
                    boardId: 'board-1',
                    title: 'To do column',
                    cardOder: ['card-1', 'card-2', 'card-3'],
                    cards: [
                        {
                            id: 'card-1',
                            boardId: 'board-1',
                            columnId: 'column-1',
                            title: 'Title of card 1',
                            cover: 'https://petnhatrang.com/wp-content/uploads/2020/10/0_yP7NdX2wWQVilq1_-467x400.png'
                        },
                        { id: 'card-2', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 2', cover:null},
                        { id: 'card-3', boardId: 'board-1', columnId: 'column-1', title: 'Title of card 3', cover:null}
                    ]
                },
                {
                    id: 'column-2',
                    boardId: 'board-1',
                    title: 'Inprogress column',
                    cardOder: ['card-4', 'card-5'],
                    cards: [
                        { id: 'card-4', boardId: 'board-1', columnId: 'column-2',title: 'Title of card 4',cover:null},
                        { id: 'card-5', boardId: 'board-1', columnId: 'column-2',title: 'Title of card 5',cover:null}

                    ]
                },
                {
                    id: 'column-3',
                    boardId: 'board-1',
                    title: 'Done column',
                    cardOder: ['card-6'],
                    cards: [
                        { id: 'card-6', boardId: 'board-1', columnId: 'column-3',title: 'Title of card 6',cover:null}
                    ]
                }
            ]
        }
    ]
}