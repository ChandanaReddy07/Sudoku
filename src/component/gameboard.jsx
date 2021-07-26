import React, { useState, useEffect } from "react";

import { FaUndoAlt, FaRedoAlt, FaEraser } from "react-icons/fa";
import EasyPuzzle from "../easy";
import HardPuzzle from "../hard";
import MediumPuzzle from "../medium";

import "./game.css";

function Gameboard() {
  const quads = [
    [
      [0, 0],
      [2, 2],
    ],
    [
      [0, 3],
      [2, 5],
    ],
    [
      [0, 6],
      [2, 8],
    ],
    [
      [3, 0],
      [5, 2],
    ],
    [
      [3, 3],
      [5, 5],
    ],
    [
      [3, 6],
      [5, 8],
    ],
    [
      [6, 0],
      [8, 2],
    ],
    [
      [6, 3],
      [8, 5],
    ],
    [
      [6, 6],
      [8, 8],
    ],
  ];

  let [piece, setPiece] = useState(
    [...Array(9)].map((x) => Array(9).fill("1"))
  );
  let [result, setResult] = useState(""); //Once puzzle is solved, this will also disable hint and solve it for me buttons
  let [answer, setAnswer] = useState(); //the answers will be stored here
  let [hints, setHints] = useState(0); //the answers will be stored here
  let [start, setStart] = useState(0);
  let original =
    JSON.parse(window.localStorage.getItem("original")) ||
    [...Array(9)].map((x) => Array(9).fill("1")); //will hold the original sudoku board for reseting purposes

  let [undo, setUndo] = useState([]);
  let [redo, setRedo] = useState([]);
  let [isvalid, setIsvalid] = useState(null);
  let [active, setActive] = useState(false);
  let [choosePuzzle, setChoosePuzzle] = useState(EasyPuzzle);

  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let puzzleChoice =
      EasyPuzzle[Math.floor(Math.random() * (EasyPuzzle.length - 0) + 0)];
    console.log(puzzleChoice);
    pick(puzzleChoice, false);
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  //once board is fully filled out, it will check
  useEffect(() => {
    let emptyBoard = findEmpty(piece);

    if (emptyBoard === null && start === 1) {
      let solved = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (piece[r][c] !== answer[r][c]) {
            solved = false;
            break;
          }
        }
      }

      setTimeout(() => {
        solved ? setResult("found") : setResult("error");
        // console.log('check board should be empty', start)
      }, 1000);
    }
    setStart(1);
  });

  const pick = (puzzleChoice, reset) => {
    let puzzle, ans;

    if (reset === true) {
      puzzle = puzzleChoice;
      setPiece(puzzle);
      setAnswer(answer);
      return;
    } else {
      puzzle = puzzleChoice.que;
      ans = puzzleChoice.sol;
    }
    let puzzleArr = [...Array(9)].map((x) => Array(9).fill(""));
    let ansArr = [...Array(9)].map((x) => Array(9).fill(""));
    let col = 0,
      row = 0;

    for (let i = 0; i < puzzle.length; i++) {
      let str = puzzle[i];
      let strAns = ans[i];

      if (str === "0") {
        str = "";
        puzzleArr[col][row] = str;
      } else {
        puzzleArr[col][row] = Number(str);
      }

      ansArr[col][row] = Number(strAns);
      row++;

      if ((i + 1) % 9 === 0 && i !== 0) {
        col++;
        row = 0;
      }
    }
    setPiece(puzzleArr);
    setAnswer(ansArr);

    //set the localstorage to original
    window.localStorage.setItem("original", JSON.stringify(puzzleArr));
  };
  //select new puzzle
  const newPuzzle = () => {
    let puzzleChoice =
      choosePuzzle[Math.floor(Math.random() * (choosePuzzle.length - 0) + 0)];
    pick(puzzleChoice, false);
    setResult("");
    setHints(0);
  };

  //check
  const validate = (row, col, val) => {
    let rowCheck = checkRow(row, val, 0, 8);
    let columnCheck = checkColumn(col, val, 0, 8);
    let quad = getQuad(row, col);
    let quadCheck = checkQuadraint(quad, val);

    if (rowCheck && columnCheck && quadCheck) {
      return true;
    }
    return false;
  };
  //returns the quad location based on row and column

  const getQuad = (row, column) => {
    for (let i = 0; i < quads.length; i++) {
      let rowCheck = [quads[i][0][0], quads[i][1][0]];
      let columnCheck = [quads[i][0][1], quads[i][1][1]];
      if (
        row >= rowCheck[0] &&
        row <= rowCheck[1] &&
        column >= columnCheck[0] &&
        column <= columnCheck[1]
      ) {
        return i;
      }
    }
  };
  //checkrow
  const checkRow = (row, val, left, right) => {
    let obj = new Set();
    let midpoint = left + Math.floor((right - left) / 2);

    if (piece[row][midpoint] !== undefined) {
      if (piece[row][midpoint] === val) {
        return false;
      } else {
        obj.add(piece[row][midpoint]);
      }
    }

    while (left < right) {
      if (piece[row][left] === undefined) {
        left++;
      } else {
        if (piece[row][left] === val) {
          return false;
        } else {
          obj.add(piece[row][left]);
          left++;
        }
      }

      if (piece[row][right] === undefined) {
        right--;
      } else {
        if (piece[row][right] === val) {
          return false;
        } else {
          obj.add(piece[row][right]);
          right--;
        }
      }
    }
    return true;
  };

  //0(log n) to find column
  const checkColumn = (column, val, left, right) => {
    let obj = new Set();

    let midpoint = left + Math.floor((right - left) / 2);

    //MidPoint Check
    if (piece[midpoint][column] !== undefined) {
      if (piece[midpoint][column] === val) {
        return false;
      } else {
        obj.add(piece[midpoint][column]);
      }
    }

    while (left < right) {
      if (piece[left][column] === undefined) {
        left++;
      } else {
        if (piece[left][column] === val) {
          return false;
        } else {
          obj.add(piece[left][column]);
          left++;
        }
      }

      if (piece[right][column] === undefined) {
        right--;
      } else {
        if (piece[right][column] === val) {
          return false;
        } else {
          obj.add(piece[right][column]);
          right--;
        }
      }
    }
    return true;
  };

  const checkQuadraint = (quad, val) => {
    let startRow = quads[quad][0][0];
    let endRow = quads[quad][1][0];
    let startColumn = quads[quad][0][1];
    let endColumn = quads[quad][1][1];

    for (let i = startRow; i <= endRow; i++) {
      let rows = checkRow(i, val, startColumn, endColumn);
      if (rows === false) {
        return false;
      }
    }
    return true;
  };

  //delete a value from sudoku board that wasnt prefilled originally
  const deleteVal = (row, column, e) => {
    let key = e.key;
    if (key === "Backspace" || key === "Delete") {
      let copy = [...piece];
      copy[row][column] = "";
      setPiece(copy);
    }
  };
  const findEmpty = (board) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "") {
          return [r, c];
        }
      }
    }
    return null; //if it returns null that means that puzzle is not empty
  };

  const hint = () => {
    let randomRow = Math.floor(Math.random() * (9 - 0) + 0);
    let columnPosition = [];
    for (let i = 0; i < piece[randomRow].length; i++) {
      if (piece[randomRow][i] === "") {
        columnPosition.push(i);
      }
    }

    if (columnPosition.length > 0) {
      let randomColumn =
        columnPosition[
          Math.floor(Math.random() * (columnPosition.length - 0) + 0)
        ];
      let updatedVal = answer[randomRow][randomColumn];
      updateOneNumber(randomRow, randomColumn, updatedVal);
      setHints(hints + 1);
    } else {
      hint();
    }

    //Exit
    if (findEmpty(piece) === null) {
      return setResult("found");
    }
  };
  //solve
  function solve(board, errors) {
    let currentPosition = findEmpty(board);
    //base case where the sudoku board has everything filled out correctly
    if (currentPosition === null) {
      //created a timeout to provide the illusion of calculations
      setTimeout(() => {
        setResult("found");
        setHints(0);
      }, 1400);

      return true;
    }

    for (let val = 1; val <= 9; val++) {
      if (validate(currentPosition[0], currentPosition[1], val)) {
        let copy = [...board];
        copy[currentPosition[0]][currentPosition[1]] = val;
        //created a timeout to provide the illusion of calculations
        setTimeout(() => {
          updateOneNumber(currentPosition[0], currentPosition[1], val);
        }, 1000);

        if (solve(copy, false)) {
          //now that we updated the value, we are rerunning solve , but now it is incremented till next '' cell
          return true;
        }

      }
    }

    board[currentPosition[0]][currentPosition[1]] = "";
    // //created a timeout to provide the illusion of calculations
    setTimeout(() => {
      updateOneNumber(currentPosition[0], currentPosition[1], "");
    }, 1000);

    setTimeout(() => {
      setResult("error");
    }, 1400);

    return false;
  }
  //updates oneNumber at a time
  const updateOneNumber = (row, col, val) => {
    let copy = [...piece];
    copy[row][col] = val;

    let undoob = {
      row: row,
      col: col,
      val: val,
    };

    setUndo([...undo, undoob]);
    return setPiece(copy);
  };

  const onChoosePuzzle = (name) => {
    setChoosePuzzle(name);
    newPuzzle();
  };
  const handleChange = (row, column, e) => {
    let key = e.target.value;
    setActive(true);
    let regex = "^([1-9])$";
    if (key.match(regex)) {
      let val = Number(key);
      let validated = validate(row, column, val);

      if (!validated) {
        e.preventDefault();
        setIsvalid(false);
        console.log(active);
      } else {
        let copy = [...piece];
        copy[row][column] = Number(val);
        setPiece(copy);
        let undoob = {
          row: row,
          col: column,
          val: val,
        };
        setIsvalid(true);

        setUndo([...undo, undoob]);
      
        console.log("undo", undo);
        console.log(active);
      }
    } else {
      e.preventDefault();
      setIsvalid(false);
    }
   
  };
  const reset = () => {
    pick(original, true);
    setResult("");
    setHints(0);
  };

  //undoo
  const undoo = () => {
    if (undo.length > 0) {
      let obj = undo.pop();
      let copy = [...piece];
      copy[obj.row][obj.col] = "";
      setPiece(copy);
      setRedo([...redo, obj]);
    }
  };
  const redoo = () => {
    if (redo.length > 0) {
      let obj = redo.pop();
      let copy = [...piece];
      copy[obj.row][obj.col] = Number(obj.val);
      setPiece(copy);
      setUndo([...undo, obj]);
    }
  };
  //solve

  return (
    <div>
      {/* <div>
        {minutes === 0 && seconds === 0 ? (
          <h1>GAME OVER</h1>
        ) : (
          <h1>
            {" "}
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        )}
      </div> */}
      <div className="parent">
        <div className="buttonContainer10">
          <button
            className="btn10 easy"
            onClick={() => onChoosePuzzle(EasyPuzzle)}
          >
            <p>EASY</p>
          </button>
          <button
            className="btn10 med"
            onClick={() => onChoosePuzzle(MediumPuzzle)}
          >
            <p>MEDIUM</p>
          </button>
          <button
            className="btn10 hard"
            onClick={() => onChoosePuzzle(HardPuzzle)}
          >
            <p>HARD</p>
          </button>
          <button className="btn10 new" onClick={newPuzzle}>
            <p>New </p>
          </button>
        </div>
        <div className="main">
          {piece.map((index, columns) => {
            return (
              <div className="container" key={columns}>
                <form className={`columns${columns}`}>
                  {piece[columns].map((values, rows) => {
                    return (
                      <div className={`rows${rows}`} key={[columns, rows]}>
                        <input
                          id={[columns, rows]}
                          //disables the pieces so the original ones can not be changed
                          className={isvalid ? "cell" : "err_cell"}
                          disabled={
                            original[rows][columns] !== "" ? true : false
                          }
                          value={piece[rows][columns]}
                          type="text"
                          maxLength="1"
                          size="4"
                          onKeyDown={(e) => deleteVal(rows, columns, e)}
                          onChange={(e) => handleChange(rows, columns, e)}
                        ></input>
                      </div>
                    );
                  })}
                </form>
              </div>
            );
          })}
        </div>
        <div className="buttonContainer">
          <div className="undo_redo">
            <p className="undo" onClick={undoo}>
              <FaUndoAlt />
            </p>
            <p className="redo" onClick={redoo}>
              <FaRedoAlt />
            </p>
          </div>
          <button
            className="bt1"
            disabled={result === "found" ? true : false}
            onClick={hint}
          >
            <p>Hint</p>
          </button>

          <button
            className="bt2"
            disabled={result === "found"}
            onClick={() => solve(piece, false)}
          >
            <p> Solve!</p>
          </button>

          <button className="bt3" onClick={reset}>
            <p>Reset</p>
          </button>
        </div>
      </div>

      <h2 className="solved">
        {result === "found"
          ? "Solved"
          : result === "error"
          ? "One of Your Choices is Wrong"
          : null}
      </h2>
    </div>
  );
}
export default Gameboard;
