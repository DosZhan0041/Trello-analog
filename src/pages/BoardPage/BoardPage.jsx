import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { BoardsContext } from "../../context/BoardsProvider";
import Column from "../../components/Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const BoardPage = () => {
  const { id } = useParams();
  const { boards, fetchBoards, addColumn, moveTask, editBoardTitle, authUser } = useContext(BoardsContext);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (authUser) {
      fetchBoards();
    }
  }, [authUser]);

  const board = boards.find((b) => b.id === Number(id));

  if (!board) return <p>Загрузка...</p>;

  const handleEditBoardTitle = () => {
    if (newTitle.trim() && newTitle !== board.title) {
      editBoardTitle(board.id, newTitle);
    }
    setIsEditing(false);
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") return;
    addColumn(board.id, newColumnTitle);
    setNewColumnTitle("");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board-page">
        <div className="board-header">
          {isEditing ? (
            <input 
              type="text" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              onBlur={handleEditBoardTitle} 
              onKeyDown={(e) => e.key === "Enter" && handleEditBoardTitle()} 
              autoFocus
            />
          ) : (
            <h1 onDoubleClick={() => setIsEditing(true)}>{board.title}</h1>
          )}
           <div className="new-column">
            <input 
              type="text" 
              placeholder="Название колонки" 
              value={newColumnTitle} 
              onChange={(e) => setNewColumnTitle(e.target.value)} 
            />
            <button onClick={handleAddColumn}>Добавить колонку</button>
          </div>
        </div>

        <div className="columns-container">
          {board.columns.map((column) => (
            <Column key={column.id} column={column} boardId={board.id} moveTask={moveTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default BoardPage;
