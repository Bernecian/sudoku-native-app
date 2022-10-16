let sudoku = {};
sudoku.DIGITS = "123456789"; // Allowed sudoku.DIGITS
let ROWS = "ABCDEFGHI"; // Row lables
let COLS = sudoku.DIGITS; // Column lables
let SQUARES = null; // Square IDs

let UNITS = null; // All units (row, column, or box)
let SQUARE_UNITS_MAP = null; // Squares -> units map
let SQUARE_PEERS_MAP = null; // Squares -> peers map

let MIN_GIVENS = 17; // Minimum number of givens
let NR_SQUARES = 81; // Number of squares

let DIFFICULTY = {
  easy: 62,
  medium: 53,
  hard: 44,
  insane: 26,
};

sudoku.BLANK_CHAR = ".";
sudoku.BLANK_BOARD =
  "...................................................." +
  ".............................";

// Init
// -------------------------------------------------------------------------
function initialize() {
  SQUARES = sudoku._cross(ROWS, COLS);
  UNITS = sudoku._get_all_units(ROWS, COLS);
  SQUARE_UNITS_MAP = sudoku._get_square_units_map(SQUARES, UNITS);
  SQUARE_PEERS_MAP = sudoku._get_square_peers_map(SQUARES, SQUARE_UNITS_MAP);
}

// Generate
// -------------------------------------------------------------------------
sudoku.generate = function (difficulty, unique) {
  if (typeof difficulty === "string" || typeof difficulty === "undefined") {
    difficulty = DIFFICULTY[difficulty] || DIFFICULTY.easy;
  }

  difficulty = sudoku._force_range(difficulty, NR_SQUARES + 1, MIN_GIVENS);

  unique = unique || true;

  let blank_board = "";
  for (let i = 0; i < NR_SQUARES; ++i) {
    blank_board += ".";
  }
  let candidates = sudoku._get_candidates_map(blank_board);

  let shuffled_squares = sudoku._shuffle(SQUARES);
  for (let si in shuffled_squares) {
    let square = shuffled_squares[si];

    let rand_candidate_idx = sudoku._rand_range(candidates[square].length);
    let rand_candidate = candidates[square][rand_candidate_idx];
    if (!sudoku._assign(candidates, square, rand_candidate)) {
      break;
    }
    let single_candidates = [];
    for (si in SQUARES) {
      square = SQUARES[si];

      if (candidates[square].length === 1) {
        single_candidates.push(candidates[square]);
      }
    }
    if (
      single_candidates.length >= difficulty &&
      sudoku._strip_dups(single_candidates).length >= 8
    ) {
      let board = "";
      let givens_idxs = [];
      for (i in SQUARES) {
        square = SQUARES[i];
        if (candidates[square].length === 1) {
          board += candidates[square];
          givens_idxs.push(i);
        } else {
          board += sudoku.BLANK_CHAR;
        }
      }

      let nr_givens = givens_idxs.length;
      if (nr_givens > difficulty) {
        givens_idxs = sudoku._shuffle(givens_idxs);
        for (i = 0; i < nr_givens - difficulty; ++i) {
          let target = parseInt(givens_idxs[i]);
          board =
            board.substr(0, target) +
            sudoku.BLANK_CHAR +
            board.substr(target + 1);
        }
      }

      // TODO: Make a standalone board checker. Solve is expensive.
      if (sudoku.solve(board)) {
        return board;
      }
    }
  }

  return sudoku.generate(difficulty);
};

// Solve
// -------------------------------------------------------------------------
sudoku.solve = function (board, reverse) {
  let report = sudoku.validate_board(board);
  if (report !== true) {
    throw report;
  }

  let nr_givens = 0;
  for (let i in board) {
    if (board[i] !== sudoku.BLANK_CHAR && sudoku._in(board[i], sudoku.DIGITS)) {
      ++nr_givens;
    }
  }
  if (nr_givens < MIN_GIVENS) {
    throw "Too few givens. Minimum givens is " + MIN_GIVENS;
  }
  reverse = reverse || false;

  let candidates = sudoku._get_candidates_map(board);
  let result = sudoku._search(candidates, reverse);

  if (result) {
    let solution = "";
    for (let square in result) {
      solution += result[square];
    }
    return solution;
  }
  return false;
};

sudoku.get_candidates = function (board) {
  let report = sudoku.validate_board(board);
  if (report !== true) {
    throw report;
  }

  let candidates_map = sudoku._get_candidates_map(board);

  if (!candidates_map) {
    return false;
  }

  let rows = [];
  let cur_row = [];
  let i = 0;
  for (let square in candidates_map) {
    let candidates = candidates_map[square];
    cur_row.push(candidates);
    if (i % 9 === 8) {
      rows.push(cur_row);
      cur_row = [];
    }
    ++i;
  }
  return rows;
};

sudoku._get_candidates_map = function (board) {
  let report = sudoku.validate_board(board);
  if (report !== true) {
    throw report;
  }

  let candidate_map = {};
  let squares_values_map = sudoku._get_square_vals_map(board);

  for (let si in SQUARES) {
    candidate_map[SQUARES[si]] = sudoku.DIGITS;
  }

  for (let square in squares_values_map) {
    let val = squares_values_map[square];

    if (sudoku._in(val, sudoku.DIGITS)) {
      let new_candidates = sudoku._assign(candidate_map, square, val);

      if (!new_candidates) {
        return false;
      }
    }
  }

  return candidate_map;
};

sudoku._search = function (candidates, reverse) {
  if (!candidates) {
    return false;
  }

  let max_nr_candidates = 0;
  let max_candidates_square = null;
  for (let si in SQUARES) {
    let square = SQUARES[si];

    let nr_candidates = candidates[square].length;

    if (nr_candidates > max_nr_candidates) {
      max_nr_candidates = nr_candidates;
      max_candidates_square = square;
    }
  }
  if (max_nr_candidates === 1) {
    return candidates;
  }

  let min_nr_candidates = 10;
  let min_candidates_square = null;
  for (si in SQUARES) {
    square = SQUARES[si];

    nr_candidates = candidates[square].length;

    if (nr_candidates < min_nr_candidates && nr_candidates > 1) {
      min_nr_candidates = nr_candidates;
      min_candidates_square = square;
    }
  }

  let min_candidates = candidates[min_candidates_square];
  if (!reverse) {
    for (let vi in min_candidates) {
      let val = min_candidates[vi];

      // TODO: Implement a non-rediculous deep copy function
      let candidates_copy = JSON.parse(JSON.stringify(candidates));
      let candidates_next = sudoku._search(
        sudoku._assign(candidates_copy, min_candidates_square, val)
      );

      if (candidates_next) {
        return candidates_next;
      }
    }
  } else {
    for (vi = min_candidates.length - 1; vi >= 0; --vi) {
      val = min_candidates[vi];
      // TODO: Implement a non-rediculous deep copy function
      candidates_copy = JSON.parse(JSON.stringify(candidates));
      candidates_next = sudoku._search(
        sudoku._assign(candidates_copy, min_candidates_square, val),
        reverse
      );

      if (candidates_next) {
        return candidates_next;
      }
    }
  }
  return false;
};

sudoku._assign = function (candidates, square, val) {
  let other_vals = candidates[square].replace(val, "");
  for (let ovi in other_vals) {
    let other_val = other_vals[ovi];

    let candidates_next = sudoku._eliminate(candidates, square, other_val);

    if (!candidates_next) {
      return false;
    }
  }

  return candidates;
};

sudoku._eliminate = function (candidates, square, val) {
  if (!sudoku._in(val, candidates[square])) {
    return candidates;
  }
  candidates[square] = candidates[square].replace(val, "");
  let nr_candidates = candidates[square].length;
  if (nr_candidates === 1) {
    let target_val = candidates[square];

    for (let pi in SQUARE_PEERS_MAP[square]) {
      let peer = SQUARE_PEERS_MAP[square][pi];

      let candidates_new = sudoku._eliminate(candidates, peer, target_val);

      if (!candidates_new) {
        return false;
      }
    }

  }
  if (nr_candidates === 0) {
    return false;
  }

  for (let ui in SQUARE_UNITS_MAP[square]) {
    let unit = SQUARE_UNITS_MAP[square][ui];

    let val_places = [];
    for (let si in unit) {
      let unit_square = unit[si];
      if (sudoku._in(val, candidates[unit_square])) {
        val_places.push(unit_square);
      }
    }

    if (val_places.length === 0) {
      return false;

    } else if (val_places.length === 1) {
      candidates_new = sudoku._assign(candidates, val_places[0], val);

      if (!candidates_new) {
        return false;
      }
    }
  }

  return candidates;
};

sudoku._get_square_vals_map = function (board) {
  let squares_vals_map = {};
  if (board.length !== SQUARES.length) {
    throw "Board/squares length mismatch.";
  } else {
    for (let i in SQUARES) {
      squares_vals_map[SQUARES[i]] = board[i];
    }
  }

  return squares_vals_map;
};

sudoku._get_square_units_map = function (squares, units) {
  let square_unit_map = {};

  for (let si in squares) {
    let cur_square = squares[si];

    let cur_square_units = [];

    for (let ui in units) {
      let cur_unit = units[ui];

      if (cur_unit.indexOf(cur_square) !== -1) {
        cur_square_units.push(cur_unit);
      }
    }

    square_unit_map[cur_square] = cur_square_units;
  }

  return square_unit_map;
};

sudoku._get_square_peers_map = function (squares, units_map) {
  let square_peers_map = {};

  for (let si in squares) {
    let cur_square = squares[si];
    let cur_square_units = units_map[cur_square];

    let cur_square_peers = [];

    for (let sui in cur_square_units) {
      let cur_unit = cur_square_units[sui];

      for (let ui in cur_unit) {
        let cur_unit_square = cur_unit[ui];

        if (
          cur_square_peers.indexOf(cur_unit_square) === -1 &&
          cur_unit_square !== cur_square
        ) {
          cur_square_peers.push(cur_unit_square);
        }
      }
    }

    square_peers_map[cur_square] = cur_square_peers;
  }

  return square_peers_map;
};

sudoku._get_all_units = function (rows, cols) {
  let units = [];

  // Rows
  for (let ri in rows) {
    units.push(sudoku._cross(rows[ri], cols));
  }

  // Columns
  for (let ci in cols) {
    units.push(sudoku._cross(rows, cols[ci]));
  }

  // Boxes
  let row_squares = ["ABC", "DEF", "GHI"];
  let col_squares = ["123", "456", "789"];
  for (let rsi in row_squares) {
    for (let csi in col_squares) {
      units.push(sudoku._cross(row_squares[rsi], col_squares[csi]));
    }
  }

  return units;
};

sudoku.board_string_to_grid = function (board_string) {
  let rows = [];
  let cur_row = [];
  for (let i in board_string) {
    cur_row.push(board_string[i]);
    if (i % 9 === 8) {
      rows.push(cur_row);
      cur_row = [];
    }
  }
  return rows;
};

sudoku.board_grid_to_string = function (board_grid) {
  let board_string = "";
  for (let r = 0; r < 9; ++r) {
    for (let c = 0; c < 9; ++c) {
      board_string += board_grid[r][c];
    }
  }
  return board_string;
};
sudoku.print_board = function (board) {
  let report = sudoku.validate_board(board);
  if (report !== true) {
    throw report;
  }

  let V_PADDING = " ";
  let H_PADDING = "\n";

  let V_BOX_PADDING = "  ";
  let H_BOX_PADDING = "\n"; 

  let display_string = "";

  for (let i in board) {
    let square = board[i];

    display_string += square + V_PADDING;

    if (i % 3 === 2) {
      display_string += V_BOX_PADDING;
    }

    if (i % 9 === 8) {
      display_string += H_PADDING;
    }

    if (i % 27 === 26) {
      display_string += H_BOX_PADDING;
    }
  }
};

sudoku.validate_board = function (board) {
  if (!board) {
    return "Empty board";
  }
  if (board.length !== NR_SQUARES) {
    return (
      "Invalid board size. Board must be exactly " + NR_SQUARES + " squares."
    );
  }
  for (let i in board) {
    if (
      !sudoku._in(board[i], sudoku.DIGITS) &&
      board[i] !== sudoku.BLANK_CHAR
    ) {
      return (
        "Invalid board character encountered at index " + i + ": " + board[i]
      );
    }
  }
  return true;
};

sudoku._cross = function (a, b) {
  let result = [];
  for (let ai in a) {
    for (let bi in b) {
      result.push(a[ai] + b[bi]);
    }
  }
  return result;
};

sudoku._in = function (v, seq) {
  return seq.indexOf(v) !== -1;
};

sudoku._first_true = function (seq) {
  for (let i in seq) {
    if (seq[i]) {
      return seq[i];
    }
  }
  return false;
};

sudoku._shuffle = function (seq) {
  let shuffled = [];
  for (let i = 0; i < seq.length; ++i) {
    shuffled.push(false);
  }

  for (i in seq) {
    let ti = sudoku._rand_range(seq.length);

    while (shuffled[ti]) {
      ti = ti + 1 > seq.length - 1 ? 0 : ti + 1;
    }

    shuffled[ti] = seq[i];
  }

  return shuffled;
};

sudoku._rand_range = function (max, min) {
  min = min || 0;
  if (max) {
    return Math.floor(Math.random() * (max - min)) + min;
  } else {
    throw "Range undefined";
  }
};

sudoku._strip_dups = function (seq) {
  let seq_set = [];
  let dup_map = {};
  for (let i in seq) {
    let e = seq[i];
    if (!dup_map[e]) {
      seq_set.push(e);
      dup_map[e] = true;
    }
  }
  return seq_set;
};

sudoku._force_range = function (nr, max, min) {
  min = min || 0;
  nr = nr || 0;
  if (nr < min) {
    return min;
  }
  if (nr > max) {
    return max;
  }
  return nr;
};

initialize();

export const getSudoku = () => {
  return sudoku;
};
