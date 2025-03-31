import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../../context/BoardsProvider";

const DashboardPage = () => {
  const { boards, addBoard, deleteBoard, authUser } = useContext(BoardsContext);
  const [boardTitle, setBoardTitle] = useState("");
  const navigate = useNavigate();

  if (!authUser) {
    return <p>Загрузка пользователя...</p>;
  }

  const handleCreateBoard = () => {
    if (boardTitle.trim() === "") return;
    addBoard(boardTitle);
    setBoardTitle("");
  };

  return (
    <div className="dashboard">
      <h1>Мои доски</h1>
      <div className="new-board">
        <input
          type="text"
          placeholder="Название доски"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
        />
        <button onClick={handleCreateBoard}>Создать</button>
      </div>
      <div className="board-list">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <h3 onClick={() => navigate(`/board/${board.id}`)}>{board.title}</h3>
            <button onClick={() => deleteBoard(board.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
