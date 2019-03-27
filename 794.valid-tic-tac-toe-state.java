/*
 * @lc app=leetcode id=794 lang=java
 *
 * [794] Valid Tic-Tac-Toe State
 *
 * https://leetcode.com/problems/valid-tic-tac-toe-state/description/
 *
 * algorithms
 * Medium (28.84%)
 * Total Accepted:    9.6K
 * Total Submissions: 33K
 * Testcase Example:  '["O  ","   ","   "]'
 *
 * A Tic-Tac-Toe board is given as a string array board. Return True if and
 * only if it is possible to reach this board position during the course of a
 * valid tic-tac-toe game.
 * 
 * The board is a 3 x 3 array, and consists of characters " ", "X", and "O".
 * The " " character represents an empty square.
 * 
 * Here are the rules of Tic-Tac-Toe:
 * 
 * 
 * Players take turns placing characters into empty squares (" ").
 * The first player always places "X" characters, while the second player
 * always places "O" characters.
 * "X" and "O" characters are always placed into empty squares, never filled
 * ones.
 * The game ends when there are 3 of the same (non-empty) character filling any
 * row, column, or diagonal.
 * The game also ends if all squares are non-empty.
 * No more moves can be played if the game is over.
 * 
 * 
 * 
 * Example 1:
 * Input: board = ["O  ", "   ", "   "]
 * Output: false
 * Explanation: The first player always plays "X".
 * 
 * Example 2:
 * Input: board = ["XOX", " X ", "   "]
 * Output: false
 * Explanation: Players take turns making moves.
 * 
 * Example 3:
 * Input: board = ["XXX", "   ", "OOO"]
 * Output: false
 * 
 * Example 4:
 * Input: board = ["XOX", "O O", "XOX"]
 * Output: true
 * 
 * 
 * Note:
 * 
 * 
 * board is a length-3 array of strings, where each string board[i] has length
 * 3.
 * Each board[i][j] is a character in the set {" ", "X", "O"}.
 * 
 * 
 */
class Solution {
    public boolean validTicTacToe(String[] board) {
        if (board == null || board.length == 0) {
            return false;
        }
        
        // turns = 0 represents 'X' will move, otherwise 'O' will move
        int turns = 0;
        
        // check whether 'X' wins or 'O' wins, or no players win
        boolean xWin = isGameOver(board, 'X');
        boolean oWin = isGameOver(board, 'O');
        
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[0].length(); j++) {
                if (board[i].charAt(j) == 'X') {
                    turns++;
                } else if (board[i].charAt(j) == 'O') {
                    turns--;
                }
            }
        }
        
        /**
         * Four conditions will be the invalid tic tac toe board:
         * 1. there are more 'O' than 'X'
         * 2. the board has 2 more 'X' than 'O'
         * 3. number of 'X' is equal to number of 'O', but 'X' wins, it is impossible because if 'X' wins, the game is 
         * over, 'O' cannot play again, then number of 'O' MUST less than 'X'
         * 4. number of 'X' is more than number of 'O', but 'O' wins, it is impossible because if 'O' wins, the game is
         * over, 'X' cannot play again, then number of 'X' CANNOT greater than 'O'
         * */
        if (turns < 0 || turns > 1 || turns == 0 && xWin || turns == 1 && oWin) {
            return false;
        }
        return true;
    }
    
    private boolean isGameOver(String[] board, char player) {
        // check horizontal
        for (int i = 0; i < 3; i++) {
            if (board[i].charAt(0) == player && board[i].charAt(0) == board[i].charAt(1) && board[i].charAt(1) == board[i].charAt(2)) {
                return true;
            }
        }
        
        // check vertical
        for (int j = 0; j < 3; j++) {
            if (board[0].charAt(j) == player && board[0].charAt(j) == board[1].charAt(j) && board[1].charAt(j) == board[2].charAt(j)) {
                return true;
            }
        }
        
        // check diagonal
        if (board[1].charAt(1) == player && (board[0].charAt(0) == board[1].charAt(1) && board[1].charAt(1) == board[2].charAt(2)
            || board[0].charAt(2) == board[1].charAt(1) && board[1].charAt(1) == board[2].charAt(0))) {
            return true;
        }
        return false;
    }
}

