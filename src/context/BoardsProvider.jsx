import React, { createContext, useState, useEffect } from "react";

export const BoardsContext = createContext(null);

const BoardsProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setAuthUser(user);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      console.log("Theme changed to:", newTheme);
      return newTheme;
    });
  };

  const fetchBoards = async () => {
    if (!authUser) return;
    try {
      const res = await fetch("http://localhost:8080/boards");
      const data = await res.json();
      setBoards(data.filter((board) => board.userId === authUser.id));
    } catch (error) {
      console.error("Ошибка загрузки досок:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [authUser]);


  const addBoard = async (title) => {
    if (!authUser) return;
    const newBoard = {
      id: Date.now(),
      title,
      userId: authUser.id,
      columns: []
    };

    try {
      await fetch("http://localhost:8080/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBoard),
      });
      fetchBoards(); 
    } catch (error) {
      console.error("Ошибка добавления доски:", error);
    }
  };

  const deleteBoard = async (id) => {
    try {
      await fetch(`http://localhost:8080/boards/${id}`, {
        method: "DELETE",
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка удаления доски:", error);
    }
  };

  const addColumn = async (boardId, columnTitle) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
  
    if (board.columns.length >= 4) {
      console.warn("Нельзя создать больше 4 колонок");
      return;
    }
  
    const newColumn = { id: Date.now(), title: columnTitle, tasks: [] };
    const updatedBoard = { ...board, columns: [...board.columns, newColumn] };
  
    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка добавления колонки:", error);
    }
  };
  

  const editColumn = async (boardId, columnId, newTitle) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка редактирования колонки:", error);
    }
  };

  const deleteColumn = async (boardId, columnId) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.filter(col => col.id !== columnId);
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка удаления колонки:", error);
    }
  };

  const moveColumn = async (boardId, sourceIndex, destinationIndex) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = [...board.columns];
    const [movedColumn] = updatedColumns.splice(sourceIndex, 1);
    updatedColumns.splice(destinationIndex, 0, movedColumn);
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка перемещения колонки:", error);
    }
  };

  const addTask = async (boardId, columnId, taskTitle) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, { id: Date.now(), title: taskTitle, completed: false }] }
        : col
    );
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка добавления карточки:", error);
    }
  };

  const editTask = async (boardId, columnId, taskId, newTitle) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.map(task => task.id === taskId ? { ...task, title: newTitle } : task) }
        : col
    );
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка редактирования карточки:", error);
    }
  };

  const deleteTask = async (boardId, columnId, taskId) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    );
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка удаления карточки:", error);
    }
  };

  const moveTask = async (boardId, taskId, sourceColumnId, newColumnId) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
  
    const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
    const targetColumn = board.columns.find((col) => col.id === newColumnId);
    if (!sourceColumn || !targetColumn) return;

    const task = sourceColumn.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedColumns = board.columns.map((col) => {
      if (col.id === sourceColumnId) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      }
      if (col.id === newColumnId) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    });
  
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoards((prev) => prev.map((b) => (b.id === boardId ? updatedBoard : b)));

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
    } catch (error) {
      console.error("Ошибка сохранения перемещения:", error);
    }
  };

  const editBoardTitle = async (boardId, newTitle) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
  
    const updatedBoard = { ...board, title: newTitle };
  
    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка редактирования названия доски:", error);
    }
  };
  
  
  const toggleTaskCompletion = async (boardId, columnId, taskId) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    const updatedColumns = board.columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : col
    );
    const updatedBoard = { ...board, columns: updatedColumns };

    try {
      await fetch(`http://localhost:8080/boards/${boardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBoard),
      });
      fetchBoards();
    } catch (error) {
      console.error("Ошибка обновления статуса карточки:", error);
    }
  };

  return (
    <BoardsContext.Provider value={{
      boards,
      authUser,
      fetchBoards,
      addBoard,
      deleteBoard,
      addColumn,
      editColumn,
      deleteColumn,
      moveColumn,
      addTask,
      editTask,
      deleteTask,
      moveTask,
      toggleTaskCompletion,
      editBoardTitle,
      theme,
      toggleTheme
    }}>
      {children}
    </BoardsContext.Provider>
  );
};

export default BoardsProvider;
